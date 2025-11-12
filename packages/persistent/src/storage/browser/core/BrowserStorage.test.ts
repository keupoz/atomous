import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockSetItem } from '../../../../test/mockSetItem'
import { StringStorage } from '../StringStorage'

describe('only triggers when specified storage, key and value were changed', () => {
  const localStringStorage = new StringStorage('test', localStorage)
  const sessionStringStorage = new StringStorage('test', sessionStorage)

  const localSpy = vi.fn().mockName('localStorageSpy')
  const sessionSpy = vi.fn().mockName('sessionStorageSpy')

  localStringStorage.listen(localSpy)
  sessionStringStorage.listen(sessionSpy)

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    localSpy.mockClear()
    sessionSpy.mockClear()
  })

  it('sets new value to local storage', () => {
    localStorage.setItem('test', 'initial value')
    mockSetItem('test', 'new value', localStorage)

    expect(localSpy).toBeCalled()
    expect(sessionSpy).not.toBeCalled()
  })

  it('sets new value to session storage', () => {
    sessionStorage.setItem('test', 'initial value')
    mockSetItem('test', 'new value', sessionStorage)

    expect(localSpy).not.toBeCalled()
    expect(sessionSpy).toBeCalled()
  })

  it('sets same value', () => {
    localStorage.setItem('test', 'initial value')
    sessionStorage.setItem('test', 'initial value')

    mockSetItem('test', 'initial value', localStorage)
    mockSetItem('test', 'initial value', sessionStorage)

    expect(localSpy).not.toBeCalled()
    expect(sessionSpy).not.toBeCalled()
  })

  it('sets a value with a different key', () => {
    mockSetItem('some-key', 'some value', localStorage)
    mockSetItem('some-key', 'some value', sessionStorage)

    expect(localSpy).not.toBeCalled()
    expect(sessionSpy).not.toBeCalled()
  })
})
