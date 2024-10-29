import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { aes_encrypt } from '@/utils/aes-secret';
import { UserResponse } from './user.response';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string): Promise<UserResponse> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { username: true, email: true, password: true, id: true },
    });
  }

  async register(
    user: RegisterDto,
  ): Promise<{ username?: string; isExist?: boolean }> {
    // 先查找email是否存在
    const res = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (res) {
      return {
        isExist: true,
      };
    } else {
      const password = aes_encrypt(user.password);
      return this.prisma.user.create({
        data: { ...user, password },
        select: { username: true },
      });
    }
  }
}
