import { createClient } from 'redis'
import 'dotenv/config.js'

export const cacheClient = await createClient({ url: process.env.CACHE_CLIENT })
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()

export type CacheClient = typeof cacheClient
