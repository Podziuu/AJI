import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/createProductDto';

@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }
}
