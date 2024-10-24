import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '用户名',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '邮箱',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '密码',
  })
  password: string;
}
