import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { atom } from 'atomous'
import { expect, it } from 'vitest'
import { defineComponent, effect, h } from 'vue'
import { atomRef } from '.'

it('renders atom value and listens to changes', async () => {
  let renders = 0
  const $count = atom(0)

  const Component1 = defineComponent(() => {
    const count = atomRef($count)

    effect(() => {
      void count.value
      renders++
    })

    return () => h('span', { 'data-testid': 'value1' }, count.value)
  })

  const Component2 = defineComponent(() => {
    const count = atomRef($count)

    return () => h('span', { 'data-testid': 'value2' }, count.value)
  })

  const Wrapper = defineComponent(() => {
    return () => h('div', [
      h('button', { onClick: () => $count.update(value => value + 1) }, 'Increment'),
      h(Component1),
      h(Component2),
    ])
  })

  const screen = render(Wrapper)

  expect(renders).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('0')
  expect(screen.getByTestId('value2').textContent).toBe('0')

  await userEvent.click(screen.getByRole('button'))

  expect(renders).toBe(2)
  expect($count.get()).toBe(1)
  expect(screen.getByTestId('value1').textContent).toBe('1')
  expect(screen.getByTestId('value2').textContent).toBe('1')
})
