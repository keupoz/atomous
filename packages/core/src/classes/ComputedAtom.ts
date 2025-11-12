import type { ValueOptions } from '../internals/AtomState'
import type { AtomConsumer } from '../internals/AtomTracker'
import { AtomTracker } from '../internals/AtomTracker'
import { Atom } from './Atom'

export type Computation<TValue> = () => TValue

export class ComputedAtom<TValue> extends Atom<TValue> implements AtomConsumer {
  private readonly tracker = new AtomTracker(this)
  private readonly compute: Computation<TValue>

  constructor(compute: Computation<TValue>, options?: ValueOptions<TValue>) {
    super(options)
    this.compute = compute
  }

  protected override createValue(): TValue {
    return this.tracker.run(this.compute)
  }
}
