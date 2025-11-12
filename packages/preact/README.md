# @atomous/preact

This package provides a hook for Preact to subscribe to atom changes and get its value.

## Installation

Use your favorite package manager or a 3rd-party tool to import the library in browser.

```bash
npm i @atomous/preact
```

```html
<script src="https://cdn.jsdelivr.net/npm/@atomous/preact"></script>
```

```javascript
import atomous from 'https://esm.run/@atomous/preact'
```

## Usage

```tsx
import { useAtomValue } from '@atomous/preact'
import { atom } from 'atomous'

const $count = atom(0)

export function Counter() {
  const count = useAtomValue($count)

  function increment() {
    $count.update(count => count + 1)
  }

  return <button type="button" onClick={increment}>Count is {count}</button>
}
```
