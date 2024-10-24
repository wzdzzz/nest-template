import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.prisma.author.create({ data: createAuthorDto });
  }

  findAll() {
    return this.prisma.author.findMany();
  }

  findOne(id: number) {
    return this.prisma.author.findUnique({ where: { id } });
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return this.prisma.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  remove(id: number) {
    return this.prisma.author.delete({ where: { id } });
  }
}
