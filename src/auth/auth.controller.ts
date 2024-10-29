import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtGuard, Public } from './jwt-auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponse } from '../users/user.response';

@ApiTags('权限管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('/user')
  @ApiOperation({ summary: '获取用户信息' })
  async getUser(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginDto, description: '输入用户名和密码' })
  async login(@Req() req: Request) {
    return await this.authService.generateToken(req.user as UserResponse);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: '注册' })
  @ApiBody({ type: RegisterDto, description: '输入用户名和密码' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Delete('/logout')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '退出登录' })
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user as UserResponse);
  }
}
