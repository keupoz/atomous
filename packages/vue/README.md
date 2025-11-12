# @atomous/vue

This package provides a function to create a readable ref from an atom that can be used in Vue components.

## Installation

Use your favorite package manager or a 3rd-party tool to import the library in browser.

```bash
npm i @atomous/vue
```

```html
<script src="https://cdn.jsdelivr.net/npm/@atomous/vue"></script>
```

```javascript
import atomous from 'https://esm.run/@atomous/vue'
```

## Usage

```typescript
// state.ts
import { atom } from 'atomous'

export const $count = atom(0)
```

```vue
<script>
import { atomRef } from '@atomous/vue'
import { $count } from './state'

const count = atomRef($count)

function increment() {
  $count.update(count => count + 1)
}
</script>

<template>
  <button type="button" @click="increment">
    Count is {{ count }}
  </button>
</template>
```
