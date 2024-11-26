import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { LoadProductsService } from "./loadProducts.service";


@Controller('/api/init')
@UseGuards(AuthGuard)
export class LoadProductsController {
    constructor(private readonly loadProductsService: LoadProductsService) {}

    @Post()
    loadProducts() {
        return this.loadProductsService.loadProducts();
    }
}