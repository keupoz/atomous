import { AtomBatch } from './internals/AtomBatch'

/**
 * Batch atom updates.
 *
 * @example
 * const $firstName = atom('John')
 * const $lastName = atom('Doe')
 * const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)
 *
 * $fullName.subscribe(console.log)
 *
 * // Only logs 'William Miller'
 * batch(() => {
 *   $firstName.set('Jane')
 *   $lastName.set('Smith')
 *
 *   $firstName.set('William')
 *   $lastName.set('Miller')
 * })
 */
export function batch(callback: () => void) {
  AtomBatch.start()
  callback()
  AtomBatch.stop()
}

/** Batch atom updates in an async callback. */
export async function batchAsync(callback: () => Promise<void>) {
  AtomBatch.start()
  await callback()
  AtomBatch.stop()
}
