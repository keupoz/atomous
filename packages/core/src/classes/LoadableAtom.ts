import type { ValueCleanup, ValueCompare, ValueOptions } from '../internals/AtomState'
import type { AtomConsumer } from '../internals/AtomTracker'
import { AtomBatch } from '../internals/AtomBatch'
import { AtomTracker } from '../internals/AtomTracker'
import { Atom } from './Atom'

export interface LoadableStateLoading {
  status: 'loading'
}

export interface LoadableStateSuccess<TValue> {
  status: 'success'
  value: TValue
}

export interface LoadableStateError {
  status: 'error'
  error: unknown
}

export type LoadableState<TValue> = LoadableStateLoading | LoadableStateSuccess<TValue> | LoadableStateError

function compareState<TValue>(compare: ValueCompare<TValue>, a: LoadableState<TValue>, b: LoadableState<TValue>) {
  return a.status === b.status && 'value' in a && 'value' in b && compare(a.value, b.value)
}

function cleanupState<TValue>(cleanup: ValueCleanup<TValue>, oldState: LoadableState<TValue>, newState: LoadableState<TValue> | undefined) {
  if ('value' in oldState) {
    const newValue = newState && 'value' in newState ? newState.value : undefined
    cleanup(oldState.value, newValue)
  }
}

export class LoadableAtom<TValue> extends Atom<LoadableState<TValue>> implements AtomConsumer {
  private readonly source: Atom<Promise<TValue>>
  private readonly tracker = new AtomTracker(this)

  private controller?: AbortController

  constructor(source: Atom<Promise<TValue>>, options?: ValueOptions<TValue>) {
    super(options && {
      compare: (compareState<TValue>).bind(null, options.compare ?? Object.is),
      cleanup: options.cleanup && (cleanupState<TValue>).bind(null, options.cleanup),
    })

    this.source = source
    this.tracker.track(source)

    this.init = this.init.bind(this)
  }

  private createSignal() {
    this.controller = new AbortController()
    return this.controller.signal
  }

  protected override createValue(): LoadableState<TValue> {
    this.init()
    return { status: 'loading' }
  }

  private async init() {
    const signal = this.createSignal()

    try {
      const value = await this.source.get()

      if (signal.aborted) return

      this.set({ status: 'success', value })
    } catch (error) {
      if (signal.aborted) return

      console.error('LoadableAtom: Source promise rejected.', error)
      this.set({ status: 'error', error })
    }
  }

  public override reset(): void {
    this.controller?.abort('Atom reset')

    if (this.raw()?.status === 'loading') {
      AtomBatch.addOrRun(this.init)
    } else {
      super.reset()
    }
  }
}
