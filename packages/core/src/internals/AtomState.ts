export type ValueCreate<TValue> = () => TValue

export type ValueCompare<TValue> = (a: TValue, b: TValue) => boolean
export type ValueCleanup<TValue> = (oldValue: TValue, newValue: TValue | undefined) => void

export interface ValueOptions<TValue> {
  /** Function for comparing the old and the new value. Default is `Object.is`. */
  compare?: ValueCompare<TValue>

  /** Callback used to cleanup the old value. */
  cleanup?: ValueCleanup<TValue>
}

export interface StateRef<TValue> {
  value: TValue
}

export class AtomState<TValue> {
  /** Compare two values for equality. */
  private readonly compare: ValueCompare<TValue>

  /** Cleanup provided value. */
  private readonly cleanup?: ValueCleanup<TValue>

  /** Internal state object. */
  private state?: StateRef<TValue>

  constructor(options?: ValueOptions<TValue>) {
    this.compare = options?.compare ?? Object.is
    this.cleanup = options?.cleanup
  }

  /** Get the state object. */
  public get() {
    return this.state
  }

  /** Set a new state object. Calls cleanup if possible and returns true if new state has been successfully set. */
  public set(state: StateRef<TValue> | undefined) {
    if (this.state) {
      if (state && this.compare(this.state.value, state.value)) return false
      this.cleanup?.(this.state.value, state?.value)
    }

    this.state = state

    return true
  }
}
