import { expect, it } from 'vitest'
import { StringStorage } from './StringStorage'

it('correctly decodes value', () => {
  const storage = new StringStorage('test')

  expect(storage.decode('some string')).toEqual({ value: 'some string' })
  expect(storage.decode('"some quoted string"')).toEqual({ value: '"some quoted string"' })
})

it('correctly encodes value', () => {
  const storage = new StringStorage('test')

  expect(storage.encode('some string')).toBe('some string')
  expect(storage.encode('"some quoted string"')).toBe('"some quoted string"')
})
