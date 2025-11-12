type Unlisten = () => void

export interface AtomStorageItem<TValue> {
  value: TValue
}

export type AtomStorageListener<TValue> = (item: AtomStorageItem<TValue> | null) => void

export interface AtomStorage<TValue> {
  /** Get item stored in this storage. */
  getItem: () => AtomStorageItem<TValue> | null

  /** Store item in this storage. */
  setItem: (value: TValue) => void

  /** Remove current item from the storage. */
  removeItem: () => void

  /** Listen to changes of this storage. */
  listen: (listener: AtomStorageListener<TValue>) => Unlisten

  /** Remove the listener of changes of this storage. */
  unlisten: (listener: AtomStorageListener<TValue>) => void

  /** Remove all listeners. */
  dispose: () => void
}
