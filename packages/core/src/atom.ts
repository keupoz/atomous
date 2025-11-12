import { RegularAtom } from './classes/RegularAtom'

/**
 * Create a regular atom.
 *
 * @example
 * const $count = atom(0)
 *
 * $count.subscribe(count => console.log(`Count is ${count}`))
 *
 * function increment() {
 *   $count.update(count => count + 1)
 * }
 *
 * increment()
 * $count.set(100)
 */
export function atom<TValue>(...parameters: ConstructorParameters<typeof RegularAtom<TValue>>) {
  return new RegularAtom(...parameters)
}
