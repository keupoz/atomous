import type { ValueCleanup, ValueCompare, ValueOptions } from '../internals/AtomState'
import type { AtomConsumer } from '../internals/AtomTracker'
import { AtomBatch } from '../internals/AtomBatch'
import { AtomTracker } from '../internals/AtomTracker'
import { Atom } from './Atom'

export interface LoadingState {
  status: 'loading'
}

export interface SuccessState<TValue> {
  status: 'success'
  data: TValue
}

export interface ErrorState {
  status: 'error'
  error: unknown
}

export interface AbortedState {
  status: 'aborted'
}

export type AsyncState<TData> = LoadingState | SuccessState<TData> | ErrorState | AbortedState
export type ValueFetcher<TSource, TValue> = (source: TSource, signal: AbortSignal) => Promise<TValue>

function compareState<TData>(compare: ValueCompare<TData>, a: AsyncState<TData>, b: AsyncState<TData>) {
  return a.status === b.status && 'data' in a && 'data' in b && compare(a.data, b.data)
}

function cleanupState<TData>(cleanup: ValueCleanup<TData>, state: AsyncState<TData>) {
  if ('data' in state) cleanup(state.data)
}

/** @deprecated since 0.2.0, use `LoadableAtom` instead */
export class AsyncAtom<TSource, TData> extends Atom<AsyncState<TData>> implements AtomConsumer {
  private readonly tracker?: AtomTracker
  private readonly source: Atom<TSource> | TSource
  private readonly fetcher: ValueFetcher<TSource, TData>

  private controller?: AbortController

  constructor(source: Atom<TSource> | TSource, fetcher: ValueFetcher<TSource, TData>, options?: ValueOptions<TData>) {
    super(options && {
      compare: (compareState<TData>).bind(null, options.compare ?? Object.is),
      cleanup: options.cleanup && (cleanupState<TData>).bind(null, options.cleanup),
    })

    this.source = source
    this.fetcher = fetcher

    this.load = this.load.bind(this)

    if (source instanceof Atom) {
      this.tracker = new AtomTracker(this)
      this.tracker.track(source)
    }
  }

  protected override createValue(): AsyncState<TData> {
    this.load()
    return { status: 'loading' }
  }

  public override set(value: AsyncState<TData>): void {
    this.controller?.abort()
    super.set(value)
  }

  /** Create a new signal. */
  private createSignal() {
    this.controller = new AbortController()
    return this.controller.signal
  }

  /** Abort current loading. */
  public abort() {
    const state = this.raw()

    if (state && (state.status === 'aborted' || state.status === 'success')) return

    this.controller?.abort()
    this.set({ status: 'aborted' })
  }

  /** Asynchronisouly load the data. */
  private async load() {
    const source = this.source instanceof Atom ? this.source.get() : this.source
    const signal = this.createSignal()

    try {
      const value = await this.fetcher.call(null, source, signal)

      if (signal.aborted) return

      this.set({ status: 'success', data: value })
    } catch (error) {
      if (signal.aborted) return

      console.error('AsyncAtom: Failed to load.', error)
      this.set({ status: 'error', error })
    }
  }

  public override reset() {
    const state = this.raw()

    this.controller?.abort()

    if (state?.status === 'loading') {
      AtomBatch.addOrRun(this.load)
    } else {
      super.reset()
    }
  }
}
