export interface CacheRepository {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: any, ttl: number): Promise<void>
  delete(key: string): Promise<void>
  createKeyName(entity: string, identifier: string, property?: string): string
}
