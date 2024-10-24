import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('书籍')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: '创建书籍' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: '获取所有书籍' })
  findAll() {
    return this.booksService.findAll();
  }

  @Public()
  @Get()
  @Version('1')
  @ApiOperation({ summary: '获取所有书籍' })
  findAllV1() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定书籍' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新指定书籍' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定书籍' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
