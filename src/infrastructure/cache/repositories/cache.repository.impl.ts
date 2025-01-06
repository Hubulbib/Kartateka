import { CacheRepository } from '../../../core/repositories/cache/cache.repository.js'
import { type CacheClient } from '../index.js'

export class CacheRepositoryImpl implements CacheRepository {
  constructor(private readonly cacheRepository: CacheClient) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.cacheRepository.get(key)
    return data ? JSON.parse(data) : null
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const data = JSON.stringify(value)
    await this.cacheRepository.set(key, data, {
      EX: ttl, // TTL в секундах
    })
  }

  async delete(key: string): Promise<void> {
    await this.cacheRepository.del(key)
  }

  createKeyName(entity: string, identifier: string, property?: string) {
    return `app:${entity}:${identifier}:${property ? property : ''}`
  }
}
