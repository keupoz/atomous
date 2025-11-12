<script>
  import { count, incrementRenders } from '../state'

  $effect(() => {
    void $count
    incrementRenders()
  })
</script>

<span data-testid='value1'>{$count}</span>
