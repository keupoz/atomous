import type { StorageHandler } from './StorageListener'
import { beforeEach, expect, it, vi } from 'vitest'
import { StorageListener } from './StorageListener'

beforeEach(() => {
  vi.restoreAllMocks()
})

it('removes global listener when all internal handlers are gone', async () => {
  if (gc === undefined) {
    throw new Error('Run the test with --expose-gc flag')
  }

  const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockName('addEventListener')
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener').mockName('removeEventListener')

  StorageListener.register({ handleEvent: () => {} })
  StorageListener.register({ handleEvent: () => {} })

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).not.toHaveBeenCalled()

  window.dispatchEvent(new StorageEvent('storage'))

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).not.toHaveBeenCalled()

  await gc({ execution: 'async' })
  window.dispatchEvent(new StorageEvent('storage'))

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
})

it('removes global listener when all internal handlers are unregistered', async () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockName('addEventListener')
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener').mockName('removeEventListener')

  const handler1: StorageHandler = { handleEvent: () => {} }
  const handler2: StorageHandler = { handleEvent: () => {} }

  StorageListener.register(handler1)
  StorageListener.register(handler2)

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).not.toHaveBeenCalled()

  window.dispatchEvent(new StorageEvent('storage'))

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).not.toHaveBeenCalled()

  StorageListener.unregister(handler1)
  StorageListener.unregister(handler2)

  window.dispatchEvent(new StorageEvent('storage'))

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
})
