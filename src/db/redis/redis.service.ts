import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async keys(key: string): Promise<string[]> {
    return await (this.cacheManager.store as any)?.keys(key);
  }

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    return await this.cacheManager.del(key);
  }

  async lRange(key: string) {
    return await (this.cacheManager.store as any).lRange(key, 0, 1);
  }
}
