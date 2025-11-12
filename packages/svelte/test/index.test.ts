import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import Wrapper from './components/Wrapper.svelte'
import { count, getRenders } from './state'

it('renders atom value and listens to changes', async () => {
  const screen = render(Wrapper)

  expect(getRenders()).toBe(1)
  expect(count.get()).toBe(0)
  expect(screen.getByTestId('value1').textContent).toBe('0')
  expect(screen.getByTestId('value2').textContent).toBe('0')

  await userEvent.click(screen.getByRole('button'))

  expect(getRenders()).toBe(2)
  expect(count.get()).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('1')
  expect(screen.getByTestId('value2').textContent).toBe('1')
})
