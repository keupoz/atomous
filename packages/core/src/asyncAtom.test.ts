import { expect, it, vi } from 'vitest'
import { asyncAtom } from './asyncAtom'
import { atom } from './atom'

vi.useFakeTimers()

function wait() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

async function resolve() {
  await vi.runAllTimersAsync()
}

async function advance() {
  await vi.advanceTimersByTimeAsync(500)
}

it('only loads on demand', async () => {
  let startedLoading = false

  const $async = asyncAtom('some value', async (value) => {
    startedLoading = true
    await wait()
    return value
  })

  await resolve()
  expect(startedLoading).toBe(false)

  $async.subscribe(() => {})

  await resolve()
  expect(startedLoading).toBe(true)
})

it('correctly loads and handles source changes', async () => {
  const $name = atom('John Doe')
  const $greeting = asyncAtom($name, async (name) => {
    await wait()
    return `Hello, ${name}!`
  })

  let calls = 0
  let expectedCalls = 0

  $greeting.subscribe(() => calls++)
  expect($greeting.get()).toEqual({ status: 'loading' })
  expect(calls).toBe(++expectedCalls)

  await resolve()
  expect($greeting.get()).toEqual({ status: 'success', data: 'Hello, John Doe!' })
  expect(calls).toBe(++expectedCalls)

  $name.set('Jane Smith')
  expect($greeting.get()).toEqual({ status: 'loading' })
  expect(calls).toBe(++expectedCalls)

  await advance()
  $name.set('William Miller')
  expect($greeting.get()).toEqual({ status: 'loading' })
  expect(calls).toBe(expectedCalls)

  await resolve()
  expect($greeting.get()).toEqual({ status: 'success', data: 'Hello, William Miller!' })
  expect(calls).toBe(++expectedCalls)
})

it('correctly handles abort', async () => {
  const $name = atom('John Doe')
  const $greeting = asyncAtom($name, async (name) => {
    await wait()
    return `Hello, ${name}!`
  })

  let calls = 0
  let expectedCalls = 0

  $greeting.subscribe(() => calls++)
  expectedCalls++

  async function abort() {
    await advance()
    $greeting.abort()
    await resolve()
  }

  await abort()
  expect($greeting.get()).toEqual({ status: 'aborted' })
  expect(calls).toBe(++expectedCalls)

  $name.set('Jane Smith')
  expectedCalls++

  await resolve()
  expect($greeting.get()).toEqual({ status: 'success', data: 'Hello, Jane Smith!' })
  expect(calls).toBe(++expectedCalls)

  await abort()
  expect($greeting.get()).toEqual({ status: 'success', data: 'Hello, Jane Smith!' })
  expect(calls).toBe(expectedCalls)
})
