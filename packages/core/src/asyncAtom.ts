import { AsyncAtom } from './classes/AsyncAtom'

/**
 * Create an async atom. Accepts an atom or a plain value as a source, and a fetcher function to load the data.
 *
 * @example
 * const $userId = atom(1)
 * const $user = asyncAtom($userId, (userId, signal) => {
 *   return fetch(`/api/users/${userId}`, { signal })
 * })
 *
 * $user.subscribe((state) => {
 *   switch (state.status) {
 *     case 'loading': return console.log('Loading ...')
 *     case 'error': return console.error(state.error)
 *     case 'success': return console.log('User loaded.', state.data)
 *   }
 * })
 */
export function asyncAtom<TSource, TValue>(...parameters: ConstructorParameters<typeof AsyncAtom<TSource, TValue>>) {
  return new AsyncAtom(...parameters)
}
