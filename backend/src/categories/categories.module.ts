import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
