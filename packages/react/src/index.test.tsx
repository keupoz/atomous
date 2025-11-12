import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { atom } from 'atomous'
import { expect, it } from 'vitest'
import { useAtomValue } from '.'

it('renders atom value and listens to changes', async () => {
  let renders = 0
  const $count = atom(0)

  function Component1() {
    renders++
    const count = useAtomValue($count)

    return <span data-testid="value1">{count}</span>
  }

  function Component2() {
    const count = useAtomValue($count)

    return <span data-testid="value2">{count}</span>
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

  const screen = render(<Wrapper />)

  expect(renders).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('0')
  expect(screen.getByTestId('value2').textContent).toBe('0')

  await userEvent.click(screen.getByRole('button'))

  expect(renders).toBe(2)
  expect($count.get()).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('1')
  expect(screen.getByTestId('value2').textContent).toBe('1')
})
