import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdersModule, StatusModule],
})
export class AppModule {}
