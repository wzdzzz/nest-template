import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { Cache } from 'cache-manager';

describe('RedisService', () => {
  let redisService: RedisService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call cacheManager.get with the correct key', async () => {
    const mockValue = 'testValue';
    const mockKey = 'testKey';
    (cacheManager.get as jest.Mock).mockResolvedValue(mockValue);

    const result = await redisService.get<string>(mockKey);
    expect(cacheManager.get).toHaveBeenCalledWith(mockKey);
    expect(result).toBe(mockValue);
  });

  it('should call cacheManager.set with the correct key and value', async () => {
    const mockKey = 'testKey';
    const mockValue = 'testValue';
    const mockTTL = 1000;

    await redisService.set(mockKey, mockValue, mockTTL);
    expect(cacheManager.set).toHaveBeenCalledWith(mockKey, mockValue, mockTTL);
  });

  it('should call cacheManager.del with the correct key', async () => {
    const mockKey = 'testKey';

    await redisService.del(mockKey);
    expect(cacheManager.del).toHaveBeenCalledWith(mockKey);
  });
});
