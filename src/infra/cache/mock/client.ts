import { Cache } from '@data/protocols';

export class CacheMock implements Cache {
  private readonly cache = new Map();

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, data: string | number | Buffer): Promise<void> {
    this.cache.set(key, data);
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }
}
