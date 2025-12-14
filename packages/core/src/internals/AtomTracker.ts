import type { Atom } from '../classes/Atom'

export interface AtomSource {
  addConsumer: (consumer: AtomConsumer) => void
  removeConsumer: (consumer: AtomConsumer) => void
}

export interface AtomConsumer {
  reset: () => void
}

export type ComputationGetter = <TValue>(atom: Atom<TValue>) => TValue
export type Computation<TResult> = (get: ComputationGetter, signal: AbortSignal) => TResult

export class AtomTracker {
  private static current?: AtomTracker

  /** Track the source by the current running tracker. */
  public static track(source: AtomSource) {
    this.current?.track(source)
  }

  private readonly consumer: AtomConsumer
  private readonly sources = new Set<AtomSource>()
  private running = false

  constructor(consumer: AtomConsumer) {
    this.consumer = consumer
  }

  /** Start tracking the source. */
  public track(source: AtomSource) {
    source.addConsumer(this.consumer)
    this.sources.add(source)
  }

  /** Stop tracking the source. */
  public untrack(source: AtomSource) {
    source.removeConsumer(this.consumer)
    this.sources.delete(source)
  }

  /** Stop tracking all sources. */
  public dispose() {
    for (const source of this.sources) {
      source.removeConsumer(this.consumer)
    }

    this.sources.clear()
  }

  private runTracked<TResult>(fn: () => TResult) {
    const prevTracker = AtomTracker.current
    AtomTracker.current = this

    try {
      return fn()
    } finally {
      AtomTracker.current = prevTracker
    }
  }

  /** Run a function and return the result keeping track of dependencies. */
  public run<TResult>(compute: Computation<TResult>, signal: AbortSignal) {
    if (this.running) throw new Error('Recursion detected')

    this.dispose()
    this.running = true

    const get: ComputationGetter = (atom) => {
      if (signal.aborted) throw new Error('AtomTracker: Accessing atom value after abort.')
      return this.runTracked(() => atom.get())
    }

    try {
      return this.runTracked(() => compute(get, signal))
    } finally {
      this.running = false
    }
  }
}
