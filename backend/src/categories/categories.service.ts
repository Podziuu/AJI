import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    const categories = await this.prisma.category.findMany();
    if (categories.length === 0) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }
}
