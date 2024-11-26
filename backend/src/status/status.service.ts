import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatusService {
    constructor(private readonly prisma: PrismaService) {}
    
    async findAll() {
        const statuses = await this.prisma.orderStatus.findMany();
        if (statuses.length === 0) {
            throw new NotFoundException('No statuses found');
        }
        return statuses;
    }
}
