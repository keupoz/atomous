export type BatchCallback = () => void

export class AtomBatch {
  private static readonly callbacks = new Set<BatchCallback>()

  private static busy = false
  private static depth = -1

  private static checkAvailability() {
    if (this.busy) throw new Error('Batch is busy')
  }

  /** Marks the batch as started. */
  public static start() {
    this.checkAvailability()
    this.depth++
  }

  /** Adds the callback to the queue or runs it immediately if batch is not started. */
  public static addOrRun(callback: BatchCallback) {
    this.checkAvailability()

    if (this.depth === -1) callback()
    else this.callbacks.add(callback)
  }

  /** Runs the queue and unmarks the batch as started. */
  public static stop() {
    this.checkAvailability()

    if (this.depth > -1) this.depth--
    if (this.depth > -1) return

    this.busy = true

    try {
      for (const callback of this.callbacks) {
        callback()
      }
    } finally {
      this.callbacks.clear()
      this.busy = false
    }
  }
}
