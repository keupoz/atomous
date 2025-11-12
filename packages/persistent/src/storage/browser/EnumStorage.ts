import { BrowserStorage } from './core/BrowserStorage'

export type Enum = Record<string, string | number>

export class EnumStorage<TEnum extends Enum> extends BrowserStorage<TEnum[keyof TEnum]> {
  private readonly options: string[] = []

  constructor(key: string, theEnum: TEnum, storage?: Storage) {
    super(key, storage)

    for (const [key, value] of Object.entries(theEnum)) {
      if (Number.isNaN(Number.parseInt(key))) {
        this.options.push(value.toString())
      }
    }
  }

  public override decode(value: string) {
    if (!this.options.includes(value)) return null

    const parsed = Number.parseInt(value)
    const result = Number.isNaN(parsed) ? value : parsed
    return { value: result as TEnum[keyof TEnum] }
  }

  public override encode(value: TEnum[keyof TEnum]) {
    return value.toString()
  }
}
