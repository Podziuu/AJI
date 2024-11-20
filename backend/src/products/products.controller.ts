import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProductDto';

@Controller('/api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return 'This action returns all products';
  }

  @Get(':id')
  findOne() {
    return 'This action returns a product';
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update() {
    return 'This action updates a product';
  }
}
