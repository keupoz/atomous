import { expect, it } from 'vitest'
import { EnumStorage } from './EnumStorage'

enum TestEnum {
  SOME,
  OTHER = 'other',
}

it('correctly decodes value', () => {
  const storage = new EnumStorage('test', TestEnum)

  expect(storage.decode('0')).toEqual({ value: TestEnum.SOME })
  expect(storage.decode('other')).toEqual({ value: TestEnum.OTHER })

  expect(storage.decode('unknown')).toBe(null)
})

it('correctly encodes value', () => {
  const storage = new EnumStorage('test', TestEnum)

  expect(storage.encode(TestEnum.SOME)).toBe('0')
  expect(storage.encode(TestEnum.OTHER)).toBe('other')
})
