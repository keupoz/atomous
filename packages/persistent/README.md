# @atomous/persistent

This package provides a type of writable atom that stores a value and synchronises it with provided external storage.

## Installation

Use your favorite package manager or a 3rd-party tool to import the library in browser.

```bash
npm i @atomous/persistent
```

```html
<script src="https://cdn.jsdelivr.net/npm/@atomous/persistent"></script>
```

```javascript
import atomous from 'https://esm.run/@atomous/persistent'
```

### Example

```typescript
import { persistent, StringStorage } from '@atomous/persistent'

const $locale = persistent('en', new StringStorage('locale'))
```

## Storage types

This package provides built-in storage types to sync with localStorage, sessionStorage or any other type of storage with the same API. Default storage is `localStorage`.

> If stored value can't be decoded then the interface returns it as `null` and the atom value is set to the initial value that was provided when the atom was created.

### Primitive types

- `new BooleanStorage(<key>, [storage])`
- `new NumberStorage(<key>, [storage])`
- `new StringStorage(<key>, [storage])`

### Complex types

- `new EnumStorage(<key>, <enum>, [storage])` - designed to work with TypeScript enums and thus is type-safe.

```typescript
import { EnumStorage, persistent } from '@atomous/persistent'

enum RenderEngine {
  Manifold = 'manifold',
  ThreeBVH = 'threebvh',
  JSCAD = 'jscad',
}

const $renderEngine = persistent(RenderEngine.Manifold, new EnumStorage('render-engine', RenderEngine))
```

- `new JsonStorage(<key>, <schema>, [storage])` - designed to work with validators that implement the [standard schema](https://github.com/standard-schema/standard-schema) interface. Stored value is always jsonified.

```typescript
import { JsonStorage, persistent } from '@atomous/persistent'
import { number, object, partial, string } from 'valibot'

const FormSchema = object({
  firstName: string(),
  lastName: string(),
  age: number()
})

const $formState = persistent({}, new JsonStorage('form-state', partial(FormSchema), sessionStorage))
```
