import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatusService {
    constructor(private readonly prisma: PrismaService) {}
    
    findAll() {
        return this.prisma.orderStatus.findMany();
    }
}
