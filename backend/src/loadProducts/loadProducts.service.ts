import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateAndUpdateProductDto } from "src/products/dto/createProductDto";


@Injectable()
export class LoadProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async loadProducts(productDTOs: CreateAndUpdateProductDto[]) {
        const products = await this.prisma.product.findMany();
        if (products.length > 0) {
            throw new BadRequestException("Products already loaded");
        }
        await this.prisma.product.createMany({
            data: productDTOs,
        });
        return "Products loaded successfully";
    }

}