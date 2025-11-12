export interface AtomSource {
  addConsumer: (consumer: AtomConsumer) => void
  removeConsumer: (consumer: AtomConsumer) => void
}

export interface AtomConsumer {
  reset: () => void
}

export class AtomTracker {
  private static current?: AtomTracker

  /** Track the source by the current running tracker. */
  public static track(source: AtomSource) {
    this.current?.track(source)
  }

  private readonly sources = new Set<AtomSource>()
  private running = false

  private readonly consumer: AtomConsumer

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

  /** Run a function and return the result keeping track of dependencies. */
  public run<TParameters extends unknown[], TResult>(fn: (...args: TParameters) => TResult, ...args: TParameters) {
    if (this.running) throw new Error('Recursion detected')

    const prevTracker = AtomTracker.current
    AtomTracker.current = this

    this.dispose()
    this.running = true

    try {
      return fn(...args)
    } finally {
      AtomTracker.current = prevTracker
      this.running = false
    }
  }
}
