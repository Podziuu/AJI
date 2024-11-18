import { Controller, Get } from '@nestjs/common';

@Controller('/api/category')
export class CategoriesController {
    @Get()
    findAll() {
        return 'This action returns all categories';
    }
}
