import { expect, it } from 'vitest'
import { atom } from './atom'
import { batch } from './batch'

it('correctly returns stored value', () => {
  const $atom = atom('initial')

  expect($atom.get()).toBe('initial')

  $atom.set('another')
  expect($atom.get()).toBe('another')

  $atom.reset()
  expect($atom.get()).toBe('initial')
})

it('correctly handles custom compare', () => {
  const $atom = atom({ value: 'initial' }, {
    compare(a, b) {
      return a.value === b.value
    },
  })

  const log: string [] = []
  $atom.subscribe(({ value }) => log.push(value))

  $atom.set({ value: 'initial' })
  $atom.set({ value: 'initial' })
  $atom.set({ value: 'another' })
  $atom.set({ value: 'another' })

  expect(log).toEqual(['initial', 'another'])
})

it('correctly calls cleanup', () => {
  const log: string[] = []
  const $atom = atom('initial', {
    cleanup(value) {
      log.push(value)
    },
  })

  $atom.set('first')
  $atom.set('second')
  $atom.set('third')

  $atom.reset()

  expect(log).toEqual(['initial', 'first', 'second', 'third'])
})

it('correctly calls subscribers', () => {
  const $atom = atom('initial')

  const log: string[] = []
  $atom.subscribe(value => log.push(value))

  $atom.set('first')
  $atom.set('second')
  $atom.set('third')

  expect(log).toEqual(['initial', 'first', 'second', 'third'])
})

it('supports batch', () => {
  const $atom = atom('initial')

  const log: string[] = []
  $atom.subscribe(value => log.push(value))

  batch(() => {
    $atom.set('first')
    $atom.set('second')
    $atom.set('third')
  })

  expect(log).toEqual(['initial', 'third'])
})

it('does not call listeners on same value', () => {
  const value = 'some value'
  const $atom = atom(value)

  const log: string[] = []
  $atom.subscribe(value => log.push(value))

  $atom.set(value)
  $atom.set(value)
  $atom.set(value)

  expect(log).toEqual([value])
})
