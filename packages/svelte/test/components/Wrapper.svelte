<script>
  import { count } from '../state'
  import Component1 from './Component1.svelte'
  import Component2 from './Component2.svelte'
</script>

<div>
  <button type='button' on:click={() => count.update(value => value + 1)}>Increment</button>
  <Component1 />
  <Component2 />
</div>
