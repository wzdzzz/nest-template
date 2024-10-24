import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: '书名',
  })
  title: string;

  @ApiProperty({
    description: '价格',
  })
  price: number;

  @ApiProperty({
    description: '作者id',
  })
  authorId: number;
}
