import { Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/orders')
@UseGuards(AuthGuard)
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
