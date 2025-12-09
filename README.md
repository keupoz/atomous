# atomous

> ⚠️ This library is still in beta! While the API is mostly stable it may change in the future. The concepts of the library may also change and the library itself needs battle testing.

An atom-based state manager for **React**, **Preact**, **Vue**, **Svelte**, **SolidJS**, and vanilla JS.

- **Atomic**. Values are stored per atom instance. No need to call a selector function on every value change.
- **Signals-like**. Computed atoms track dependencies automatically.
- **Batchable**. Setters can be called in a batch to reduce recomputations.
- **TypeScript-first**. This library is written in TypeScript and has good TypeScript support.
- **Framework agnostic**. Makes it easy to manipulate the state without any frameworks.

## Installation

Use your favorite package manager or a 3rd-party tool to import the library in browser.

```bash
npm i atomous
```

```html
<script src="https://cdn.jsdelivr.net/npm/atomous"></script>
```

```javascript
import atomous from 'https://esm.run/atomous'
```

### Example

> The $ symbol is not required in atom names, it's just a convenient way to name them.

```javascript
import { atom } from 'atomous'

const $count = atom(0)

$count.subscribe(count => console.log(`Count is ${count}`))

function increment() {
  $count.update(value => value + 1)
}

increment()
```

## Plugins

### Extra atoms

- **[persistent](./packages/persistent/)** - synchronises its value with provided storage (e.g. localStorage or other custom solutions)

### Integrations

- **[React](./packages/react/)**
- **[Preact](./packages/preact/)**
- **[SolidJS](./packages/solid/)**
- **[Vue](./packages/vue/)**
- **Svelte** - atoms implement Svelte's Store contract, no plugins required.

## Usage

### Atoms

All atom types can be created via either a function or a class constructor. Value of any type of atom is only initialized on subscribe or a first get call.

#### Regular atom

Regular atom class. Used to just store a value.

- **Function**: `atom(<initialValue>, [options])`
- **Class**: `new RegularAtom(<initialValue>, [options])`

```javascript
import { atom } from 'atomous'

const $count = atom(0)

$count.subscribe((count) => {
  console.log(`Count is ${count}`)
})

// Dynamically update the value
$count.update(count => count + 1)

// Set a completely new value
$count.set(123)
```

#### Computed atom

This atom computes its value using provided function and automatically tracks used dependencies.

- **Function**: `computed(<compute>, [options])`
- **Class**: `new ComputedAtom(<compute>, [options])`

```javascript
import { atom, computed } from 'atomous'

const $count = atom(0)
const $double = computed(() => {
  return $count.get() * 2
})

$double.subscribe((double) => {
  console.log(`Double is ${double}`)
})

// Changing any dependency will update the value
$count.update(count => count + 1) // $double will be updated
```

##### Computed promises

> Added in `0.2.0`

Computed atoms provide a get helper and an abort signal to the computation callback. These can be used to compute promises.

```typescript
import { computed } from 'atomous'

const $userId = computed((get, signal) => {
  return fetchJson('/api/users/current', { signal })
})

const $userPosts = computed(async (get, signal) => {
  const userId = await get($userId)
  const posts = await fetchJson(`/api/users/${userId}`, { signal })

  return posts
})
```

##### Explicitly setting value

Computed atoms support setting their value explicitly. It will be replaced with the new computed value when triggered.

```typescript
import { atom, computed } from 'atomous'

const $firstName = atom('John')
const $lastName = atom('Doe')
const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)

// Set value explicitly
$fullName.set('Jane Smith')

// Update dependencies to update the computed value
$firstName.set('William')
$lastName.set('Miller')

// ... or mark the computed atom to recompute its value
$fullName.reset()
```

#### Async atom

This atom is similar to computed atom but is designed for asynchronous data loading.

- **Function**: `asyncAtom(<source>, <load>, [options])`
- **Class**: `new AsyncAtom(<source>, <load>, [options])`

> The `source` parameter can be either an atom or a plain value.

> Async atoms also support setting their value explicitly. See [Computed atom](#computed-atom) for example.

```javascript
import { asyncAtom, atom } from 'atomous'

const $postId = atom(123)
const $postData = asyncAtom($postId, async (postId, signal) => {
  const result = await fetch(`/posts/${postId}`, { signal })
  const json = await result.json()

  return json
})

// State example
$postData.get() // { status: "success", data: { /* data */ } }

// Abort current loading
$postData.abort()
```

#### Value options

All atoms accept an options object. It can be used to provide custom compare function or a cleanup callback.

```typescript
import { atom } from 'atomous'

const $atom = atom({
  value: 'some value',
  dispose() {
    console.log('Disposed')
  }
}, {
  // Used to check if two values equal
  compare(a, b) {
    return a.value === b.value
  },

  // Called with current value when new value is set either explicitly or automatically
  cleanup(obj) {
    obj.dispose()
  }
})
```

### Batches

### Sync batch

Atom setters can be called in a batch to reduce recomputations.

- `batch(<callback>)`

```typescript
import { atom, batch, computed } from 'atomous'

const $firstName = atom('John')
const $lastName = atom('Doe')
const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)

// $fullName updates only once with a value equal to 'William Miller'
batch(() => {
  $firstName.set('Jane')
  $lastName.set('Smith')

  $firstName.set('William')
  $lastName.set('Miller')
})
```

#### Async batch

Batch has an asynchronous version that supports calling async functions.

```typescript
import { asyncBatch, atom, computed } from 'atomous'

const $firstName = atom('John')
const $lastName = atom('Doe')
const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)

// $fullName is updated after exiting the batch callback
asyncBatch(async () => {
  $firstName.set('Jane')
  await waitForSomething()
  $lastName.set('Smith')
})
```

#### Batching your own callbacks

You can batch your own functions like this:

```typescript
import { AtomBatch, batch } from 'atomous'

// Batched callbacks are called after exiting the batch callback
batch(() => {
  AtomBatch.addOrRun(callback1)
  AtomBatch.addOrRun(callback2)
})

// Batches can be nested. All callbacks will be called after exiting all batch callbacks
batch(() => {
  AtomBatch.addOrRun(callback1)

  batch(() => {
    AtomBatch.addOrRun(nested1)
    AtomBatch.addOrRun(nested2)
  })

  AtomBatch.addOrRun(callback2)
})

// Running the method outside a batch will run provided callback immediately
AtomBatch.addOrRun(callback)
```
