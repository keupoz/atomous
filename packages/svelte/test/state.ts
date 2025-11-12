import { atom } from 'atomous'

export const count = atom(0)

let renders = 0

export function incrementRenders() {
  renders++
}

export function getRenders() {
  return renders
}
