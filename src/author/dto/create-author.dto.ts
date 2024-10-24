import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '姓名',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '年龄',
  })
  age: number;

  @IsString()
  @ApiProperty({
    description: '生日(时间戳)',
  })
  birthday: string;
}
