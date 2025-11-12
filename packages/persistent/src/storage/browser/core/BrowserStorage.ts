import type { AtomStorage, AtomStorageItem, AtomStorageListener } from '../../AtomStorage'
import type { StorageHandler } from './StorageListener'
import { StorageListener } from './StorageListener'

export abstract class BrowserStorage<TValue> implements AtomStorage<TValue>, StorageHandler {
  public readonly key: string
  public readonly storage: Storage

  private readonly listeners = new Set<AtomStorageListener<TValue>>()

  constructor(key: string, storage = localStorage) {
    this.key = key
    this.storage = storage

    StorageListener.register(this)
  }

  /** Parse stringified value. */
  public abstract decode(value: string): AtomStorageItem<TValue> | null

  /** Stringify value to store in the storage. */
  public abstract encode(value: TValue): string

  public handleEvent(event: StorageEvent) {
    // Skip if different storage was affected
    // (why can it be null?)
    if (event.storageArea !== this.storage) return

    // Skip if key is present and it's not equal to the associated key
    // It can be null if the whole storage was cleared
    if (event.key !== null && event.key !== this.key) return

    // Skip if value wasn't changed
    // Can happen when the key was deleted first and then the whole storage was cleared
    if (event.newValue === event.oldValue) return

    const item = this.createItem(event.newValue)

    for (const listener of this.listeners) {
      listener(item)
    }
  }

  private createItem(value: string | null) {
    if (value === null) return null
    return this.decode(value)
  }

  public getItem() {
    const value = this.storage.getItem(this.key)
    return this.createItem(value)
  }

  public setItem(value: TValue) {
    this.storage.setItem(this.key, this.encode(value))
  }

  public removeItem() {
    this.storage.removeItem(this.key)
  }

  public listen(listener: AtomStorageListener<TValue>) {
    this.listeners.add(listener)
    return this.unlisten.bind(this, listener)
  }

  public unlisten(listener: AtomStorageListener<TValue>) {
    this.listeners.delete(listener)
  }

  public dispose() {
    this.listeners.clear()
    StorageListener.unregister(this)
  }
}
