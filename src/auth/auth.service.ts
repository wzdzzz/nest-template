import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { aes_encrypt } from '../utils/aes-secret';
import { UserResponse } from '../users/user.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUser(email);
    const isSame = aes_encrypt(password) === user?.password;
    if (user && isSame) {
      return user;
    }
  }

  async generateToken(user: UserResponse) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto) {
    return await this.usersService.register(user);
  }
}
