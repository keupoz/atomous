import type { StandardSchemaV1 } from '@standard-schema/spec'
import { BrowserStorage } from './core/BrowserStorage'

export class JsonStorage<TValue> extends BrowserStorage<TValue> {
  public readonly schema: StandardSchemaV1<TValue>

  constructor(key: string, schema: StandardSchemaV1<TValue>, storage?: Storage) {
    super(key, storage)
    this.schema = schema
  }

  public decode(value: string) {
    try {
      const raw = JSON.parse(value)
      const parsed = this.schema['~standard'].validate(raw)

      if (parsed instanceof Promise) {
        throw new TypeError('Async schemas are not supported')
      }

      if (parsed.issues) return null

      return { value: parsed.value }
    } catch (error) {
      console.error('JsonStorage: Failed to decode.', error)
      return null
    }
  }

  public encode(value: TValue): string {
    return JSON.stringify(value)
  }
}
