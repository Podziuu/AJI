import { Injectable } from '@nestjs/common';
import { CreateAndUpdateProductDto } from './dto/createProductDto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAndUpdateProductDto) {
    return this.prisma.product.create({ data });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  update(id: string, data: CreateAndUpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
}
