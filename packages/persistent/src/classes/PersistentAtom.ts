import type { ValueOptions } from 'atomous'
import type { AtomStorage, AtomStorageItem } from '../storage/AtomStorage'
import { Atom } from 'atomous'

export class PersistentAtom<TValue> extends Atom<TValue> {
  private readonly initialValue: TValue
  private readonly storage: AtomStorage<TValue>

  constructor(initialValue: TValue, storage: AtomStorage<TValue>, options?: ValueOptions<TValue>) {
    super(options)

    const item = storage.getItem()
    this.write(item ? item.value : initialValue)

    this.initialValue = initialValue
    this.storage = storage
    this.storageHandler = this.storageHandler.bind(this)

    this.storage.listen(this.storageHandler)
  }

  private storageHandler(item: AtomStorageItem<TValue> | null) {
    if (item) super.set(item.value)
    else super.reset()
  }

  protected override createValue(): TValue {
    const item = this.storage.getItem()
    return item ? item.value : this.initialValue
  }

  public override set(value: TValue): void {
    this.storage.setItem(value)
    super.set(value)
  }

  public override reset() {
    this.storage.removeItem()
    super.reset()
  }
}
