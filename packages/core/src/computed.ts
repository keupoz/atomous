import { ComputedAtom } from './classes/ComputedAtom'

/**
 * Create a computed atom. Automatically tracks dependencies.
 *
 * @example
 * const $firstName = atom('John')
 * const $lastName = atom('Doe')
 * const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)
 *
 * $fullName.subscribe(fullName => console.log(`Full name is ${fullName}`))
 *
 * $firstName.set('Jane')
 * $lastName.set('Smith')
 *
 * // Explicitly set the value
 * $fullName.set('William Miller')
 *
 * // Notify to recompute the value
 * $fullName.trigger()
 *
 * @example
 * interface Disposable {
 *   id: number
 *   dispose: () => void
 * }
 *
 * const $objectId = atom(0)
 * const $object = computed<Disposable>(() => ({
 *   id: $objectId.get(),
 *   dispose() {
 *     console.log(`Disposed object ${this.id}`)
 *   },
 * }), {
 *   cleanup(obj) {
 *     obj.dispose()
 *   },
 * })
 */
export function computed<TValue>(...parameters: ConstructorParameters<typeof ComputedAtom<TValue>>) {
  return new ComputedAtom(...parameters)
}
