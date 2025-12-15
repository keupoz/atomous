import type { ValueCleanup, ValueCompare, ValueOptions } from '../internals/AtomState'
import type { AtomConsumer } from '../internals/AtomTracker'
import { AtomBatch } from '../internals/AtomBatch'
import { AtomTracker } from '../internals/AtomTracker'
import { Atom } from './Atom'

export interface LoadableStateLoading<TValue> {
  status: 'loading'
  value?: TValue
  error?: undefined
}

export interface LoadableStateSuccess<TValue> {
  status: 'success'
  value: TValue
  error?: undefined
}

export interface LoadableStateError<TValue> {
  status: 'error'
  value?: TValue
  error: unknown
}

export type LoadableState<TValue> = LoadableStateLoading<TValue> | LoadableStateSuccess<TValue> | LoadableStateError<TValue>

function compareState<TValue>(compare: ValueCompare<TValue>, a: LoadableState<TValue>, b: LoadableState<TValue>) {
  return Object.is(a, b) || (a.status === b.status && !(a.value === undefined || b.value === undefined) && compare(a.value, b.value))
}

function cleanupState<TValue>(cleanup: ValueCleanup<TValue>, oldState: LoadableState<TValue>, newState: LoadableState<TValue> | undefined) {
  if (newState?.status === 'success' && oldState.value !== undefined) {
    cleanup(oldState.value, newState.value)
  }
}

export class LoadableAtom<TValue> extends Atom<LoadableState<TValue>> implements AtomConsumer {
  private readonly source: Atom<Promise<TValue>>
  private readonly tracker = new AtomTracker(this)

  private controller?: AbortController
  private oldValue?: TValue

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
    return { status: 'loading', value: this.oldValue }
  }

  private async init() {
    const signal = this.createSignal()

    try {
      const value = await this.source.get()

      if (signal.aborted) return

      this.oldValue = value
      this.set({ status: 'success', value })
    } catch (error) {
      if (signal.aborted) return

      console.error('LoadableAtom: Source promise rejected.', error)
      this.set({ status: 'error', error, value: this.oldValue })
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
