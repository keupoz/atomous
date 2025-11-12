import { BrowserStorage } from './core/BrowserStorage'

export class BooleanStorage extends BrowserStorage<boolean> {
  public decode(value: string) {
    switch (value) {
      case 'true': return { value: true }
      case 'false': return { value: false }
      default: return null
    }
  }

  public encode(value: boolean) {
    return value.toString()
  }
}
