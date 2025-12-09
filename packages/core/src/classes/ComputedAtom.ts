import type { ValueOptions } from '../internals/AtomState'
import type { AtomConsumer, Computation } from '../internals/AtomTracker'
import { AtomTracker } from '../internals/AtomTracker'
import { Atom } from './Atom'

export class ComputedAtom<TValue> extends Atom<TValue> implements AtomConsumer {
  private readonly tracker = new AtomTracker(this)
  private readonly compute: Computation<TValue>

  private controller?: AbortController

  constructor(compute: Computation<TValue>, options?: ValueOptions<TValue>) {
    super(options)
    this.compute = compute
  }

  protected override createValue(): TValue {
    this.controller = new AbortController()
    return this.tracker.run(this.compute, this.controller.signal)
  }

  public override reset(): void {
    this.controller?.abort('Atom reset')
    super.reset()
  }
}
