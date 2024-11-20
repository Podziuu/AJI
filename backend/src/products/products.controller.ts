import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateAndUpdateProductDto } from './dto/createProductDto';

@Controller('/api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  create(@Body() createProductDto: CreateAndUpdateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateAndUpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}
