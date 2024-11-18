import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('/api/product')
export class ProductsController {
    @Get()
    findAll() {
        return 'This action returns all products';
    }

    @Get(':id')
    findOne() {
        return 'This action returns a product';
    }

    @Post()
    create() {
        return 'This action adds a new product';
    }

    @Put(":id")
    update() {
        return 'This action updates a product';
    }
}
