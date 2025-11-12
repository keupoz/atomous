import type { ValueOptions } from '../internals/AtomState'
import type { AtomConsumer, AtomSource } from '../internals/AtomTracker'
import { AtomBatch } from '../internals/AtomBatch'
import { AtomState } from '../internals/AtomState'
import { AtomTracker } from '../internals/AtomTracker'
import { WeakRefSet } from '../internals/WeakRefSet'

export type UpdateValue<TValue> = (value: TValue) => TValue
export type AtomListener<TValue> = (value: TValue) => void

export abstract class Atom<TValue> implements AtomSource {
  private readonly listeners = new Set<AtomListener<TValue>>()
  private readonly consumers = new WeakRefSet<AtomConsumer>()
  private readonly state: AtomState<TValue>

  private dispatching = false

  constructor(options?: ValueOptions<TValue>) {
    this.state = new AtomState(options)

    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.reset = this.reset.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  /** Create new value. */
  protected abstract createValue(): TValue

  /** Get value from the state. Can be undefined. */
  protected raw() {
    return this.state.get()?.value
  }

  /** Read value from the state. Creates and writes a new value if it's unset. */
  protected read() {
    const raw = this.state.get()

    if (raw) return raw.value

    const value = this.createValue()
    this.state.set({ value })
    return value
  }

  /** Write a new value to the state. */
  protected write(value: TValue) {
    return this.state.set({ value })
  }

  /** Clear the state value. */
  protected clear() {
    return this.state.set(undefined)
  }

  /** Get atom value. Also makes this atom tracked by the current running tracker. */
  public get() {
    AtomTracker.track(this)
    return this.read()
  }

  /** Set atom value. Notifies all dependants. */
  public set(value: TValue) {
    const success = this.write(value)
    if (success) this.notfiy()
  }

  /** Compute new value using current value. */
  public update(update: UpdateValue<TValue>) {
    this.set(update(this.read()))
  }

  /** Mark this atom to unset current value. */
  public reset() {
    const success = this.clear()
    if (success) this.notfiy()
  }

  /** Notify dependants and batch calling listeners. */
  protected notfiy() {
    // Don't try to dispatch several times if populating in a batch
    if (this.dispatching) return

    this.dispatching = true

    AtomBatch.start()
    AtomBatch.addOrRun(this.dispatch)

    for (const consumer of this.consumers) {
      consumer.reset()
    }

    AtomBatch.stop()
  }

  /** Call listeners with the current value. */
  private dispatch() {
    const value = this.read()

    for (const listener of this.listeners) {
      listener(value)
    }

    this.dispatching = false
  }

  /** Internal method. Add a dependant to notify it on changes. */
  public addConsumer(consumer: AtomConsumer) {
    this.consumers.add(consumer)
  }

  /** Internal method. Remove the dependant. */
  public removeConsumer(consumer: AtomConsumer) {
    this.consumers.delete(consumer)
  }

  /** Subcribe to this atom changes. Immediately calls the listener with the current value. */
  public subscribe(listener: AtomListener<TValue>) {
    listener(this.read())
    this.listeners.add(listener)
    return this.unsubscribe.bind(this, listener)
  }

  /** Remove the listener from this atom. */
  public unsubscribe(listener: AtomListener<TValue>) {
    this.listeners.delete(listener)
  }

  /** Remove all listeners and dependants. */
  public dispose() {
    this.listeners.clear()
    this.consumers.clear()
  }
}
