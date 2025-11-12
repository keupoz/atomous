import { WeakRefSet } from 'atomous'

export interface StorageHandler {
  handleEvent: (event: StorageEvent) => void
}

export class StorageListener {
  private static readonly handlers = new WeakRefSet<StorageHandler>()

  static {
    this.handle = this.handle.bind(this)
  }

  /** Internal handler to call all registered handlers. */
  private static handle(event: StorageEvent) {
    for (const handler of this.handlers) {
      handler.handleEvent(event)
    }

    if (this.handlers.size === 0) {
      window.removeEventListener('storage', this.handle)
    }
  }

  /**
   * Register a handler to this listener.
   * Automatically starts listening to the storage event.
   */
  public static register(handler: StorageHandler) {
    this.handlers.add(handler)

    if (this.handlers.size === 1) {
      window.addEventListener('storage', this.handle)
    }
  }

  /**
   * Remove the handler from this listener.
   * Automatically stops listening to the storage event if no handlers left.
   */
  public static unregister(handler: StorageHandler) {
    const success = this.handlers.delete(handler)

    if (this.handlers.size === 0) {
      window.removeEventListener('storage', this.handle)
    }

    return success
  }

  /** Remove all handlers from this listener and stop listening to the storage event. */
  public static dispose() {
    this.handlers.clear()
    window.removeEventListener('storage', this.handle)
  }
}
