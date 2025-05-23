import { CacheStore } from '@nestjs/common/cache';
import { createClient, RedisClientType } from 'redis';

interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  database?: number;
  reconnectAttempts?: number; // 最大重试次数，默认为 5
  reconnectInterval?: number; // 重试间隔(ms)，默认为 2000
}

export class RedisCacheStore implements CacheStore {
  private client: RedisClientType;
  private readonly reconnectAttempts: number;
  private readonly reconnectInterval: number;
  private isManuallyClosed = false;

  constructor(options: RedisOptions) {
    const {
      host,
      port,
      password,
      database,
      reconnectAttempts = 3,
      reconnectInterval = 2000,
    } = options;

    this.reconnectAttempts = reconnectAttempts;
    this.reconnectInterval = reconnectInterval;

    this.client = createClient({
      socket: { host, port },
      password,
      database,
    });

    // 一次性启动连接与重试逻辑
    void this.connectWithRetry();
  }

  /**
   * 串行重试：不会超过 reconnectAttempts 次
   */
  private async connectWithRetry(): Promise<void> {
    for (let attempt = 1; attempt <= this.reconnectAttempts; attempt++) {
      if (this.isManuallyClosed) {
        console.warn('手动关闭，不再重连');
        return;
      }

      try {
        await this.client.connect();
        console.log('Redis 连接成功');
        return;
      } catch (err) {
        console.error(`第 ${attempt} 次 Redis 连接失败：`, err);
        if (attempt < this.reconnectAttempts) {
          // 等待一段时间再重试
          await new Promise((resolve) =>
            setTimeout(resolve, this.reconnectInterval),
          );
        } else {
          console.error(
            `已超过最大重试次数 (${this.reconnectAttempts})，放弃重连。`,
          );
        }
      }
    }
  }

  /** 主动断开，阻止后续重连 */
  async disconnect(): Promise<void> {
    this.isManuallyClosed = true;
    if (this.client.isOpen) {
      await this.client.disconnect();
      console.log('Redis 已手动断开');
    }
  }

  /** 确保已连接或触发重连（仅在未手动关闭时） */
  private async ensureConnected(): Promise<void> {
    if (!this.client.isOpen || !this.client.isReady) {
      await this.connectWithRetry();
    }
  }
  // 以下方法都先 ensureConnected，避免因为断开而直接失败
  async get<T>(key: string): Promise<T | null> {
    await this.ensureConnected();
    const value = await this.client.get(key);
    return value ? (JSON.parse(value as string) as T) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.ensureConnected();
    const str = JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, ttl, str);
    } else {
      await this.client.set(key, str);
    }
  }

  async del(key: string): Promise<void> {
    await this.ensureConnected();
    await this.client.del(key);
  }

  async reset(): Promise<void> {
    await this.ensureConnected();
    await this.client.flushDb();
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnected();
    return this.client.lRange(key, start, stop);
  }

  async keys(pattern = '*'): Promise<string[]> {
    await this.ensureConnected();
    return this.client.keys(pattern);
  }
}
