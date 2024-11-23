import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderDTO } from './dto/orderDTO';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.order.findMany();
    }

    findByUserId(userId: string) {
        return this.prisma.order.findMany({
            where: {
                userId,
            },
        });
    }

    findById(id: string) {
        return this.prisma.order.findUnique({
            where: {
                id,
            },
        });
    }

    async changeStatus(id: string, newStatusName: string) {
        const newStatus = await this.prisma.orderStatus.findUnique({
            where: { name: newStatusName },
          });

        return this.prisma.order.update({
            where: {
                id,
            },
            data: {
                statusId: newStatus.id,
            },
        });
    }

    findByStatus(status: OrderStatus) {
        return this.prisma.order.findMany({
            where: {
                status,
            },
        });
    }

    create(data: OrderDTO) {
        return this.prisma.order.create({
            data,
        });
    }



    
}
