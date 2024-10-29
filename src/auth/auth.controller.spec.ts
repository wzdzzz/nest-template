import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UserResponse } from '@/users/user.response';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return the user from the request', async () => {
      const req = {
        user: { id: '1', username: 'testUser' },
      } as unknown as Request;

      const result = await authController.getUser(req);

      expect(result).toEqual(req.user);
    });
  });

  describe('login', () => {
    it('should call AuthService.generateToken with the user', async () => {
      const mockUser: UserResponse = {
        id: '1',
        email: 'test@test.com',
        username: 'Test User',
      };
      const req = { user: mockUser } as unknown as Request;
      const mockTokenResponse = { access_token: 'mockToken' };
      (authService.generateToken as jest.Mock).mockResolvedValue(
        mockTokenResponse,
      );

      const result = await authController.login(req);

      expect(authService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('register', () => {
    it('should call AuthService.register with the registration data', async () => {
      const mockRegisterDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password',
        username: 'Test User',
      };
      const mockRegisterResponse = {
        id: 1,
        email: 'test@test.com',
        username: 'Test User',
      };
      (authService.register as jest.Mock).mockResolvedValue(
        mockRegisterResponse,
      );

      const result = await authController.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockRegisterResponse);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout with the user', async () => {
      const mockUser: UserResponse = {
        id: '1',
        email: 'test@test.com',
        username: 'Test User',
      };
      const req = { user: mockUser } as unknown as Request;

      await authController.logout(req);

      expect(authService.logout).toHaveBeenCalledWith(mockUser);
    });
  });
});
