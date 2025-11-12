import type { ValueOptions } from '../internals/AtomState'
import { Atom } from './Atom'

export class RegularAtom<TValue> extends Atom<TValue> {
  private readonly initialValue: TValue

  constructor(value: TValue, options?: ValueOptions<TValue>) {
    super(options)
    this.initialValue = value
    this.write(value)
  }

  protected override createValue(): TValue {
    return this.initialValue
  }
}
