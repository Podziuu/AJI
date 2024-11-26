import { Module } from "@nestjs/common";
import { LoadProductsController } from "./loadProducts.controller";
import { LoadProductsService } from "./loadProducts.service";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Module({
    controllers: [LoadProductsController],
    providers: [LoadProductsService, PrismaService, JwtService],
})
export class LoadProductsModule {}