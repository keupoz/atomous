import type { Atom } from 'atomous'
import { useSyncExternalStore } from 'preact/compat'

/**
 * Subscribe and get atom value.
 *
 * @example
 * const $count = atom(0)
 *
 * function Counter() {
 *   const count = useAtomValue($count)
 *
 *   function increment() {
 *     $count.update(count => count + 1)
 *   }
 *
 *   return <button onClick={increment}>Count is {count}</button>
 * }
 */
export function useAtomValue<TValue>(atom: Atom<TValue>) {
  return useSyncExternalStore(atom.subscribe, atom.get)
}
