import type { LoadableState } from './classes/LoadableAtom'
import { expect, it, vi } from 'vitest'
import { atom } from './atom'
import { loadable } from './loadable'

vi.useFakeTimers()

function asyncValue<T>(value: T, ms = 1000) {
  return new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
}

function asyncError() {
  return new Promise<never>((resolve, reject) => setTimeout(() => reject(new Error('Test error')), 1000))
}

async function resolve() {
  await vi.runAllTimersAsync()
}

it('returns the correct state of the promise', async () => {
  const $promise = atom(asyncValue('value'))
  const $state = loadable($promise)

  const log: LoadableState<string>[] = []
  $state.subscribe(state => log.push(state))

  expect($state.get()).toEqual({ status: 'loading' })

  // Test duplicate loading state change
  $state.reset()

  await resolve()
  expect($state.get()).toEqual({ status: 'success', value: 'value' })

  $promise.set(asyncError())
  await resolve()
  expect($state.get()).toEqual({ status: 'error', error: new Error('Test error') })

  expect(log).toEqual([
    { status: 'loading' },
    { status: 'success', value: 'value' },
    { status: 'loading' },
    { status: 'error', error: new Error('Test error') },
  ])
})

it('correctly handles source promise changes', async () => {
  const $promise = atom(asyncValue('initial', 1000))
  const $state = loadable($promise)

  const log: LoadableState<string>[] = []
  $state.subscribe(state => log.push(state))

  $promise.set(asyncValue('new', 500))
  $promise.set(asyncValue('another', 250))
  await resolve()
  expect($state.get()).toEqual({ status: 'success', value: 'another' })

  expect(log).toEqual([
    { status: 'loading' },
    { status: 'success', value: 'another' },
  ])
})
