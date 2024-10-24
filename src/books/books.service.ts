import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({ data: createBookDto });
  }

  findAll() {
    return this.prisma.book.findMany({ where: {} });
  }

  findOne(id: string) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  remove(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }

  // 逻辑删除
  softRemove(id: string) {
    return this.prisma.book.update({
      where: { id },
      data: { is_deleted: true },
    });
  }
}
