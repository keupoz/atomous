import { BrowserStorage } from './core/BrowserStorage'

export class NumberStorage extends BrowserStorage<number> {
  public decode(value: string) {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? null : { value: parsed }
  }

  public encode(value: number) {
    return value.toString()
  }
}
