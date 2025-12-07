import { describe, expect, it } from 'vitest'
import { atom } from './atom'
import { batch } from './batch'
import { computed } from './computed'

it('correctly computes value', () => {
  const $firstName = atom('John')
  const $lastName = atom('Doe')

  const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)

  expect($fullName.get()).toBe('John Doe')

  $firstName.set('Jane')
  $lastName.set('Smith')

  expect($fullName.get()).toBe('Jane Smith')
})

it('correctly calls subscribers', () => {
  const $name = atom('John Doe')
  const $greeting = computed(() => `Hello, ${$name.get()}!`)

  const log: string[] = []
  $greeting.subscribe(value => log.push(value))

  $name.set('Jane Smith')

  expect(log).toEqual(['Hello, John Doe!', 'Hello, Jane Smith!'])
})

it('only computes on demand', () => {
  let called = false

  const $name = atom('John Doe')
  const $greeting = computed(() => {
    called = true
    return `Hello, ${$name}!`
  })

  expect(called).toBe(false)

  $greeting.get()
  expect(called).toBe(true)

  called = false
  $greeting.reset()
  expect(called).toBe(false)
})

describe('test complex graph', () => {
  let computations = 0

  const $prefix = atom('initial')

  const $itemName1 = atom('item 1')
  const $itemName2 = atom('item 2')
  const $itemName3 = atom('item 3')

  const $item1 = computed(() => `${$prefix.get()} ${$itemName1.get()}`)
  const $item2 = computed(() => `${$prefix.get()} ${$itemName2.get()}`)
  const $item3 = computed(() => `${$prefix.get()} ${$itemName3.get()}`)

  const $allItems = computed(() => {
    computations++

    return {
      prefix: $prefix.get(),
      items: [
        $item1.get(),
        $item2.get(),
        $item3.get(),
      ],
    }
  })

  const log: unknown[] = []
  $allItems.subscribe(value => log.push(value))

  let expectedComputations = 0

  it('correctly computes initial value', () => {
    expect($allItems.get()).toEqual({
      prefix: 'initial',
      items: [
        'initial item 1',
        'initial item 2',
        'initial item 3',
      ],
    })

    expect(computations).toBe(++expectedComputations)
  })

  it('computes once on one dependency change', () => {
    $prefix.set('new')

    expect($allItems.get()).toEqual({
      prefix: 'new',
      items: [
        'new item 1',
        'new item 2',
        'new item 3',
      ],
    })

    expect(computations).toBe(++expectedComputations)
  })

  it('computes once on multiple dependencies change in a batch', () => {
    batch(() => {
      $prefix.set('another')

      $itemName1.set('element 1')
      $itemName2.set('element 2')
      $itemName3.set('element 3')
    })

    expect($allItems.get()).toEqual({
      prefix: 'another',
      items: [
        'another element 1',
        'another element 2',
        'another element 3',
      ],
    })

    expect(computations).toBe(++expectedComputations)
  })
})

it('supports batch', () => {
  const $firstName = atom('John')
  const $lastName = atom('Doe')

  const $fullName = computed(() => `${$firstName.get()} ${$lastName.get()}`)

  const log: string[] = []
  $fullName.subscribe(value => log.push(value))

  batch(() => {
    $firstName.set('Jane')
    $lastName.set('Smith')

    $firstName.set('William')
    $lastName.set('Miller')
  })

  expect(log).toEqual(['John Doe', 'William Miller'])
})

it('correctly handles dynamic dependencies', () => {
  let computations = 0

  const $firstName = atom('John')
  const $lastName = atom('Doe')
  const $middleName = atom('M')

  const $enableMiddleName = atom(true)

  const $fullName = computed(() => {
    computations++

    let result = $firstName.get()

    if ($enableMiddleName.get()) {
      result += ` ${$middleName.get()}`
    }

    result += ` ${$lastName.get()}`

    return result
  })

  let expectedComputations = 0

  $enableMiddleName.set(false)
  expect($fullName.get()).toBe('John Doe')
  expect(computations).toBe(++expectedComputations)

  $middleName.set('W')
  expect($fullName.get()).toBe('John Doe')
  expect(computations).toBe(expectedComputations)

  $enableMiddleName.set(true)
  expect($fullName.get()).toBe('John W Doe')
  expect(computations).toBe(++expectedComputations)

  $middleName.set('H')
  expect($fullName.get()).toBe('John H Doe')
  expect(computations).toBe(++expectedComputations)
})

describe('test errors', () => {
  const $enableError = atom(false)
  const $firstName = atom('John')
  const $lastName = atom('Doe')

  const $fullName = computed(() => {
    if ($enableError.get()) throw new Error('Test error')

    return `${$firstName.get()} ${$lastName.get()}`
  })

  it('bubbles the error on get if it is present', () => {
    $enableError.set(true)
    expect(() => $fullName.get()).toThrowError('Test error')
  })

  it('computes new values when the error is resolved', () => {
    $firstName.set('Jane')
    $lastName.set('Smith')

    $enableError.set(false)

    expect($fullName.get()).toBe('Jane Smith')
  })
})

describe('test recursion', () => {
  const $enableRecursion = atom(false)
  const $firstName = atom('John')
  const $lastName = atom('Doe')

  const $fullName = computed((): string => {
    if ($enableRecursion.get()) {
      return $fullName.get()
    }

    return `${$firstName.get()} ${$lastName.get()}`
  })

  it('throws if recursion is detected', () => {
    $enableRecursion.set(true)
    expect(() => $fullName.get()).toThrow()
  })

  it('continues computing new values when recursion is resolved', () => {
    $firstName.set('Jane')
    $lastName.set('Smith')

    $enableRecursion.set(false)

    expect($fullName.get()).toBe('Jane Smith')
  })
})

it('correctly handles setting value explicitly', () => {
  const $name = atom('John Doe')
  const $greeting = computed(() => {
    return `Hello, ${$name.get()}!`
  })

  const log: string[] = []
  $greeting.subscribe(value => log.push(value))

  $greeting.set('Hello, Jane Smith!')
  expect($greeting.get()).toBe('Hello, Jane Smith!')

  $name.set('William Miller')
  expect($greeting.get()).toBe('Hello, William Miller!')

  expect(log).toEqual([
    'Hello, John Doe!',
    'Hello, Jane Smith!',
    'Hello, William Miller!',
  ])
})
