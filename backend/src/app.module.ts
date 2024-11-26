import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { StatusModule } from './status/status.module';
import { AuthModule } from './auth/auth.module';
import { LoadProductsModule } from './loadProducts/loadProducts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    StatusModule,
    AuthModule,
    LoadProductsModule,
  ],
})
export class AppModule {}
