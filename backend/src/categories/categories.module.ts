import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({  
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, JwtService],
})
export class CategoriesModule {}
