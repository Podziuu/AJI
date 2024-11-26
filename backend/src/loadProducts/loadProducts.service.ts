import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import * as initData from "./initData.json";


@Injectable()
export class LoadProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async loadProducts() {
        const products = await this.prisma.product.findMany();
        if (products.length == 0) {
            return { message: "Products already loaded" };
        }
        console.log(initData)
        await this.prisma.product.createMany({
            data: initData.Products,
        });
    }

}