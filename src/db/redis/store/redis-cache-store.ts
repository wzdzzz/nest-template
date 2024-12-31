import { CacheStore } from '@nestjs/common/cache';
import { createClient, RedisClientType } from 'redis';
// 自定义redisStore
export class RedisCacheStore implements CacheStore {
  private client: RedisClientType;

  constructor(options: {
    host: string;
    port: number;
    password?: string;
    database?: number;
  }) {
    const { host, port, password, database } = options;
    this.client = createClient({
      socket: {
        host,
        port,
      },
      password,
      database,
    });
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, ttl, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async reset(): Promise<void> {
    await this.client.flushDb();
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lRange(key, start, stop);
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
