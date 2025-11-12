# atomous + svelte

Atoms already implement the API used by Svelte so this package doesn't provide any utilities and is only used to test the functionality.

## Usage example

> Notice that all other examples have a $ symbol in atom names which has a special meaning in Svelte so it's not used here.

```typescript
// state.ts
import { atom } from 'atomous'

export const count = atom(0)
```

```svelte
<script>
  import { count } from './state'
</script>

<button type='button' on:click={() => count.update(value => value + 1)}>Count is {$count}</button>
```
