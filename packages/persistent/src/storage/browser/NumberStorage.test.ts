import { expect, it } from 'vitest'
import { NumberStorage } from './NumberStorage'

it('correctly decodes value', () => {
  const storage = new NumberStorage('test')

  expect(storage.decode('1.23')).toEqual({ value: 1.23 })
  expect(storage.decode('1,23')).toEqual({ value: 1 })

  expect(storage.decode('not a number')).toBe(null)
})

it('correctly encodes value', () => {
  const storage = new NumberStorage('test')

  expect(storage.encode(1.23)).toBe('1.23')
})
