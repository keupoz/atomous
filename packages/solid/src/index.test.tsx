import { render } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { atom } from 'atomous'
import { createEffect } from 'solid-js'
import { expect, it } from 'vitest'
import { fromAtom } from '.'

it('renders atom value and listens to changes', async () => {
  let renders = 0
  const $count = atom(0)

  function Component1() {
    const count = fromAtom($count)

    createEffect(() => {
      count()
      renders++
    })

    return <span data-testid="value1">{count()}</span>
  }

  function Component2() {
    const count = fromAtom($count)

    return <span data-testid="value2">{count()}</span>
  }

  function Wrapper() {
    return (
      <div>
        <button type="button" onClick={() => $count.update(value => value + 1)}>Increment</button>
        <Component1 />
        <Component2 />
      </div>
    )
  }

  const screen = render(() => <Wrapper />)

  expect(renders).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('0')
  expect(screen.getByTestId('value2').textContent).toBe('0')

  await userEvent.click(screen.getByRole('button'))

  expect(renders).toBe(2)
  expect($count.get()).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('1')
  expect(screen.getByTestId('value2').textContent).toBe('1')
})
