import { Body, Controller, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/orderDTO';
import { ChangeOrderStatusDTO } from './dto/changeOrderStatusDTO';
import { reviewDTO } from './dto/reviewDTO';

@Controller('/api/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/user/:id')
  findByUserId(@Param('id') id: string) {
    return this.ordersService.findByUserId(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() orderDTO: OrderDTO) {
    return this.ordersService.create(orderDTO);
  }

  @Patch(':id')
  changeOrderStatus(@Param('id') id: string, @Body() changeOrderStatusDTO: ChangeOrderStatusDTO) {
    return this.ordersService.changeStatus(id, changeOrderStatusDTO);
  }

  @Get('/status/:id')
  findByStatusId(@Param('id') id: string) {
    return this.ordersService.findByStatus(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() orderDTO: OrderDTO) {
    return this.ordersService.update(id, orderDTO);
  }

  @Post(':id/opinions')
  review(@Param('id') id: string, @Body() reviewDTO: reviewDTO, @Request() request: any) {
    const userId = request.user.id;
    return this.ordersService.review(id, reviewDTO, userId);
  }
}
