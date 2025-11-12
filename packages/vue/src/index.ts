import type { Atom } from 'atomous'
import type { DeepReadonly, Ref } from 'vue'
import { getCurrentScope, onScopeDispose, readonly, shallowRef } from 'vue'

/**
 * Create a read-only shallow ref from atom.
 */
export function atomRef<TValue>($atom: Atom<TValue>): DeepReadonly<Ref<TValue>> {
  const state = shallowRef($atom.get())
  const unsubscribe = $atom.subscribe(value => state.value = value)

  // Support for Vue versions prior 3.5
  if (getCurrentScope()) {
    onScopeDispose(unsubscribe)
  }

  return readonly(state)
}
