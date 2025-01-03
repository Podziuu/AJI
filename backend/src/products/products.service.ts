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

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      }
    });
    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }
    return products;
  }

  async update(id: string, data: CreateAndUpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

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
