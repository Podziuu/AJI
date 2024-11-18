import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('/api/orders')
export class OrdersController {
    @Get()
    findAll() {
        return 'This action returns all orders';
    }

    @Post()
    create() {
        return 'This action adds a new order';
    }

    @Patch(':id')
    update() {
        return 'This action updates an order';
    }

    @Get('/:status/:id')
    findStatus() {
        return 'This action returns the status of an order';
    }
}
