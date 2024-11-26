import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAndUpdateProductDto } from './dto/createProductDto';
import { PrismaService } from 'src/prisma.service';
import { OpenAiService } from './openai.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAiService,
  ) {}

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

  async getSeoDescription(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.openai.generateSeoDescription({
      name: product.name,
      category: product.category.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
    });
  }
}
