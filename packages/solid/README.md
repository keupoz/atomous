# @atomous/solid

This package provides a function to convert an atom to a readable signal that can be used in SolidJS components.

## Installation

Use your favorite package manager or a 3rd-party tool to import the library in browser.

```bash
npm i @atomous/solid
```

```html
<script src="https://cdn.jsdelivr.net/npm/@atomous/solid"></script>
```

```javascript
import atomous from 'https://esm.run/@atomous/solid'
```

## Usage

```tsx
import { fromAtom } from '@atomous/solid'
import { atom } from 'atomous'

const $count = atom(0)

export function Counter() {
  const count = fromAtom($count)

  function increment() {
    $count.update(count => count + 1)
  }

  return <button type="button" onClick={increment}>Count is {count()}</button>
}
```
