import { PersistentAtom } from './classes/PersistentAtom'

/**
 * Create a writable atom synchronised with provided storage
 *
 * @example
 * const $locale = persistent('en', new StringStorage('locale'))
 */
export function persistent<TValue>(...params: ConstructorParameters<typeof PersistentAtom<TValue>>) {
  return new PersistentAtom(...params)
}
