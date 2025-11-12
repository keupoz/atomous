import { expect, it, vi } from 'vitest'
import { batch, batchAsync } from './batch'
import { AtomBatch } from './internals/AtomBatch'

it('does not batch calls when not started', () => {
  const spy = vi.fn()

  AtomBatch.addOrRun(spy)
  AtomBatch.addOrRun(spy)
  AtomBatch.addOrRun(spy)

  expect(spy).toBeCalledTimes(3)
})

it('correctly batches sync calls', () => {
  const spy = vi.fn()

  batch(() => {
    AtomBatch.addOrRun(spy)
    AtomBatch.addOrRun(spy)
    AtomBatch.addOrRun(spy)
  })

  expect(spy).toBeCalledTimes(1)
})

it('correctly batches async calls', async () => {
  const spy = vi.fn()

  await batchAsync(async () => {
    AtomBatch.addOrRun(spy)
    await Promise.resolve()

    AtomBatch.addOrRun(spy)
    await Promise.resolve()

    AtomBatch.addOrRun(spy)
    await Promise.resolve()
  })

  expect(spy).toBeCalledTimes(1)
})
