// src/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@/db/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { aes_encrypt } from '@/utils/aes-secret';
import { UserResponse } from '@/users/user.response';
import { RegisterDto } from './dto/register.dto';

jest.mock('@/utils/aes-secret', () => ({
  aes_encrypt: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUser: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user with correct password', async () => {
    const mockUser = { id: 1, email: 'test@test.com', password: 'encrypted' };
    (usersService.findUser as jest.Mock).mockResolvedValue(mockUser);
    (aes_encrypt as jest.Mock).mockReturnValue('encrypted');

    const result = await authService.validateUser('test@test.com', 'password');

    expect(usersService.findUser).toHaveBeenCalledWith('test@test.com');
    expect(aes_encrypt).toHaveBeenCalledWith('password');
    expect(result).toEqual(mockUser);
  });

  it('should return null if password is incorrect', async () => {
    const mockUser = { id: 1, email: 'test@test.com', password: 'encrypted' };
    (usersService.findUser as jest.Mock).mockResolvedValue(mockUser);
    (aes_encrypt as jest.Mock).mockReturnValue('wrong_encrypted');

    const result = await authService.validateUser('test@test.com', 'password');

    expect(result).toBeUndefined();
  });

  it('should generate token and store in Redis', async () => {
    const mockUser: UserResponse = { id: '1', email: 'test@test.com', username: 'Test User' };
    const mockToken = 'mockToken';
    (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await authService.generateToken(mockUser);

    expect(jwtService.sign).toHaveBeenCalledWith(mockUser);
    expect(redisService.set).toHaveBeenCalledWith(
      `token_${mockUser.id}`,
      mockToken,
      3600,
    );
    expect(result).toEqual({ access_token: mockToken });
  });

  it('should call usersService.register on register', async () => {
    const mockRegisterDto: RegisterDto = { email: 'test@test.com', password: 'password', username: 'Test User' };
    const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
    (usersService.register as jest.Mock).mockResolvedValue(mockUser);

    const result = await authService.register(mockRegisterDto);

    expect(usersService.register).toHaveBeenCalledWith(mockRegisterDto);
    expect(result).toEqual(mockUser);
  });

  it('should delete token from Redis on logout', async () => {
    const mockUser: UserResponse = { id: '1', email: 'test@test.com', username: 'Test User' };

    await authService.logout(mockUser);

    expect(redisService.del).toHaveBeenCalledWith(`token_${mockUser.id}`);
  });
});
