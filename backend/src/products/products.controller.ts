import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateAndUpdateProductDto } from './dto/createProductDto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/products')
@UseGuards(AuthGuard)
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
  @UseGuards(RolesGuard)
  create(@Body() createProductDto: CreateAndUpdateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: CreateAndUpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Get(':id/seo-description')
  getSeoDescription(@Param('id') id: string) {
    return this.productsService.getSeoDescription(id);
  }
}
