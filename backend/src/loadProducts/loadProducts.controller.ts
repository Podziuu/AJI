import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { LoadProductsService } from "./loadProducts.service";
import { CreateAndUpdateProductDto } from "src/products/dto/createProductDto";


@Controller('/api/init')
@UseGuards(AuthGuard)
export class LoadProductsController {
    constructor(private readonly loadProductsService: LoadProductsService) {}

    @Post()
    loadProducts(@Body() productDTOs: CreateAndUpdateProductDto[]) {
        return this.loadProductsService.loadProducts(productDTOs);
    }
}