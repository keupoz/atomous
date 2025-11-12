import { afterEach, expect, it } from 'vitest'
import { mockSetItem } from '../test/mockSetItem'
import { persistent } from './persistent'
import { StorageListener } from './storage/browser/core/StorageListener'
import { StringStorage } from './storage/browser/StringStorage'

afterEach(() => {
  StorageListener.dispose()
  localStorage.clear()
})

it('immediately sets initial value from the storage if available', () => {
  localStorage.setItem('value', 'stored value')

  const $persistent = persistent('atom value', new StringStorage('value'))

  expect($persistent.get()).toBe('stored value')
})

it('stores value in the storage after changing and flushing the queue', () => {
  const $persistent = persistent('none', new StringStorage('value'))

  expect(localStorage.getItem('value')).toBe(null)
  $persistent.set('test')
  expect(localStorage.getItem('value')).toBe('test')
})

it('updates on storage event and resets when value is null', () => {
  const $persistent = persistent('atom value', new StringStorage('value'))

  mockSetItem('value', 'stored value')
  expect($persistent.get()).toBe('stored value')

  mockSetItem('value', null)
  expect($persistent.get()).toBe('atom value')
})

it('correctly resets value', () => {
  localStorage.setItem('value', 'stored value')

  const $persistent = persistent('atom value', new StringStorage('value'))

  $persistent.reset()
  expect($persistent.get()).toBe('atom value')
  expect(localStorage.getItem('value')).toBe(null)
})

it('correctly handles garbage collection', async () => {
  if (gc === undefined) {
    throw new Error('Run the test with --expose-gc flag')
  }

  const storageLog: string[] = []
  const atomLog: string[] = []

  function createAtom(key: string) {
    const storage = new StringStorage(key)
    const atom = persistent('initial', storage)

    storage.listen(item => storageLog.push(`${key}: ${item?.value ?? null}`))
    atom.subscribe(value => atomLog.push(`${key}: ${value}`))

    return [storage, atom]
  }

  const _uncollected = createAtom('a')
  const _collected = createAtom('b')

  mockSetItem('a', 'new')
  mockSetItem('b', 'new')

  _collected.length = 0
  await gc({ execution: 'async' })

  mockSetItem('a', 'another')
  mockSetItem('b', 'another')

  expect(storageLog).toEqual([
    'a: new',
    'b: new',
    'a: another',
  ])

  expect(atomLog).toEqual([
    'a: initial',
    'b: initial',
    'a: new',
    'b: new',
    'a: another',
  ])
})
