import { LoadableAtom } from './classes/LoadableAtom'

/**
 * Create an atom representing async state of another atom. Accepts an atom that returns a promise.
 *
 * @example
 *
 * const $userId = computed((get, signal) => {
 *   return fetchJson('/api/users/current', { signal })
 * })
 *
 * const $userPosts = computed(async (get, signal) => {
 *   const userId = await get($userId)
 *   const posts = await fetchJson(`/api/users/${userId}`, { signal })
 *
 *   return posts
 * })
 *
 * const $userPostsState = loadable($userPosts)
 *
 * $userPostsState.subscribe((state) => {
 *   switch (state.status) {
 *     case 'loading': return console.log('Loading ...')
 *     case 'error': return console.error(state.error)
 *     case 'success': return console.log('Posts loaded.', state.value)
 *   }
 * })
 */
export function loadable<TValue>(...parameters: ConstructorParameters<typeof LoadableAtom<TValue>>) {
  return new LoadableAtom(...parameters)
}
