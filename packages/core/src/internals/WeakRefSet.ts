export class WeakRefSet<TItem extends WeakKey> {
  private readonly refsCache = new WeakMap<TItem, WeakRef<TItem>>()
  private readonly refs = new Set<WeakRef<TItem>>()

  public get size() {
    return this.refs.size
  }

  public getRef(item: TItem) {
    let ref = this.refsCache.get(item)

    if (!ref) {
      ref = new WeakRef(item)
      this.refsCache.set(item, ref)
    }

    return ref
  }

  public add(item: TItem) {
    const ref = this.getRef(item)
    this.refs.add(ref)
  }

  public delete(item: TItem) {
    const ref = this.getRef(item)
    return this.refs.delete(ref)
  }

  public clear() {
    this.refs.clear()
  }

  public* [Symbol.iterator]() {
    for (const ref of this.refs) {
      const item = ref.deref()

      if (item) {
        yield item
      } else {
        this.refs.delete(ref)
      }
    }
  }
}
