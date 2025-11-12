import { BrowserStorage } from './core/BrowserStorage'

export class StringStorage extends BrowserStorage<string> {
  public decode(value: string) {
    return { value }
  }

  public encode(value: string) {
    return value
  }
}
