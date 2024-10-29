import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { aes_encrypt } from '@/utils/aes-secret';
import { RegisterDto } from '@/auth/dto/register.dto';

jest.mock('@/utils/aes-secret', () => ({
  aes_encrypt: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const mockUser = {
      id: 1,
      username: 'testUser',
      email: 'test@test.com',
      password: 'encrypted',
    };
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await usersService.findUser('test@test.com');

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
      select: { username: true, email: true, password: true, id: true },
    });
    expect(result).toEqual(mockUser);
  });

  it('should register a user if email does not exist', async () => {
    const mockRegisterDto: RegisterDto = {
      username: 'newUser',
      email: 'new@test.com',
      password: 'password',
    };
    const mockEncryptedPassword = 'encryptedPassword';
    const mockCreatedUser = { username: 'newUser' };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
    (aes_encrypt as jest.Mock).mockReturnValue(mockEncryptedPassword);
    (prismaService.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await usersService.register(mockRegisterDto);

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockRegisterDto.email },
    });
    expect(aes_encrypt).toHaveBeenCalledWith(mockRegisterDto.password);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: { ...mockRegisterDto, password: mockEncryptedPassword },
      select: { username: true },
    });
    expect(result).toEqual(mockCreatedUser);
  });

  it('should return isExist as true if email already exists', async () => {
    const mockRegisterDto: RegisterDto = {
      username: 'existingUser',
      email: 'existing@test.com',
      password: 'password',
    };
    const mockExistingUser = { id: 1, email: 'existing@test.com' };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockExistingUser);

    const result = await usersService.register(mockRegisterDto);

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockRegisterDto.email },
    });
    expect(result).toEqual({ isExist: true });
  });
});
