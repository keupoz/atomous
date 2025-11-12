import type { Atom } from 'atomous'
import { from } from 'solid-js'

/**
 * Create a readable signal from atom.
 *
 * @example
 * const $count = atom(0)
 *
 * function Counter() {
 *   const count = fromAtom($count)
 *
 *   function increment() {
 *     $count.update(count => count + 1)
 *   }
 *
 *   return <button onClick={increment}>Count is {count()}</button>
 * }
 */
export function fromAtom<TValue>(atom: Atom<TValue>) {
  return from((set) => {
    return atom.subscribe(value => set(() => value))
  }, atom.get())
}
