import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OpenAiService } from './openai.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, JwtService, OpenAiService],
})
export class ProductsModule {}
