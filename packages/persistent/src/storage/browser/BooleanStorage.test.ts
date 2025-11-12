import { expect, it } from 'vitest'
import { BooleanStorage } from './BooleanStorage'

it('correctly decodes value', () => {
  const storage = new BooleanStorage('test')

  expect(storage.decode('true')).toEqual({ value: true })
  expect(storage.decode('false')).toEqual({ value: false })

  expect(storage.decode('True')).toBe(null)
  expect(storage.decode('False')).toBe(null)

  expect(storage.decode('some other value')).toBe(null)
})

it('correctly encodes value', () => {
  const storage = new BooleanStorage('test')

  expect(storage.encode(true)).toBe('true')
  expect(storage.encode(false)).toBe('false')
})
