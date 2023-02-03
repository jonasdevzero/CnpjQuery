import 'dotenv/config';
import IoRedis from 'ioredis';
import { Cache } from '@data/protocols/Cache';

const redisConnection = process.env.REDIS_CONNECTION;

// eslint-disable-next-line import/no-mutable-exports
export let ioredis: IoRedis | undefined;

if (redisConnection) {
  ioredis = new IoRedis(redisConnection);
}

export class CacheIoRedis implements Cache {
  private readonly cacheTtl = 60 * 60 * 12;

  async get(key: string): Promise<string | null> {
    if (ioredis === undefined) return null;

    try {
      const result = await ioredis.get(key);
      return result;
    } catch (error) {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    if (ioredis === undefined) return;
    await ioredis.set(key, value);
    await ioredis.expire(key, this.cacheTtl);
  }

  async exists(key: string): Promise<boolean> {
    if (ioredis === undefined) return false;

    try {
      const exists = await ioredis.exists(key);
      return exists === 1;
    } catch (error) {
      return false;
    }
  }
}
