import { expect, it } from 'vitest'
import { atom } from './atom'
import { computed } from './computed'

it('correctly handles garbage collection', async () => {
  if (gc === undefined) {
    throw new Error('Run the test with --expose-gc flag')
  }

  const listenerLog: string[] = []
  const computedLog: string[] = []

  const $prefix = atom('initial')
  $prefix.subscribe(value => listenerLog.push(`prefix: ${value}`))

  function createAtom(name: string) {
    const $name = computed(() => {
      computedLog.push(`${name}: name`)
      return `${$prefix.get()} ${name}`
    })

    const $item = computed(() => {
      computedLog.push(`${name}: item`)
      return { name: $name.get() }
    })

    $name.subscribe(() => listenerLog.push(`${name}: name`))
    $item.subscribe(() => listenerLog.push(`${name}: item`))

    return [$name, $item]
  }

  const _uncollected = createAtom('a')
  const _collected = createAtom('b')

  $prefix.set('before gc')

  _collected.length = 0
  await gc({ execution: 'async' })

  $prefix.set('after gc')

  expect(listenerLog).toEqual([
    'prefix: initial',
    'a: name',
    'a: item',
    'b: name',
    'b: item',

    'prefix: before gc',
    'a: name',
    'a: item',
    'b: name',
    'b: item',

    'prefix: after gc',
    'a: name',
    'a: item',
  ])

  expect(computedLog).toEqual([
    // initial
    'a: name',
    'a: item',
    'b: name',
    'b: item',

    // before gc
    'a: name',
    'a: item',
    'b: name',
    'b: item',

    // after gc
    'a: name',
    'a: item',
  ])
})
