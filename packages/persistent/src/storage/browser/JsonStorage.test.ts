import { number, object, string } from 'valibot'
import { expect, it } from 'vitest'
import { JsonStorage } from './JsonStorage'

const schema = object({
  name: string(),
  age: number(),
})

it('correctly decodes value', () => {
  const storage = new JsonStorage('test', schema)

  expect(storage.decode('{ "name": "John", "age": 23 }')).toEqual({ value: { name: 'John', age: 23 } })
  expect(storage.decode('{ "name": "Kyle", "age": 18 }')).toEqual({ value: { name: 'Kyle', age: 18 } })

  expect(storage.decode('{ "invalid": "object" }')).toBe(null)
  expect(storage.decode('regular string')).toBe(null)
})

it('correctly encodes value', () => {
  const storage = new JsonStorage('test', schema)

  expect(storage.encode({ name: 'John', age: 23 })).toBe('{"name":"John","age":23}')
})
