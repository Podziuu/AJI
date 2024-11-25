//@ts-nocheck
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderDTO } from './dto/orderDTO';
import { PrismaService } from 'src/prisma.service';
import { ChangeOrderStatusDTO } from './dto/changeOrderStatusDTO';


@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    private mapOrderItems(orders) {
        return orders.map(order => ({
          ...order,
          orderItems: order.orderItems.map(({ id, quantity, product }) => ({
            id,
            quantity,
            product,
          })),
        }));
      }

    async findAll() {
        const orders = await this.prisma.order.findMany(
            {
                include: {
                    status: true,
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        return this.mapOrderItems(orders);
    }

    async findByUserId(userId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                status: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapOrderItems(orders);
    }

    async findById(id: string) {
        const orders = await this.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                status: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapOrderItems([orders]);
    }

    async changeStatus(id: string, changeOrderStatusDTO: ChangeOrderStatusDTO) {
        const newStatus = await this.prisma.orderStatus.findUnique({
            where: { name: changeOrderStatusDTO.value },
          });

        const updatedOrder = await this.prisma.order.update({
            where: {
                id,
            },
            data: {
                statusId: newStatus.id,
            },
            include: {
                status: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapOrderItems([updatedOrder]);
    }

    async findByStatus(statusId: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                statusId,
            },
            include: {
                status: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapOrderItems(orders);
    }

    async create(data: OrderDTO) {
        const createdOrder = await this.prisma.order.create({
            data: {
                user: {
                    connect: { id: data.userId },
                },
                status: {
                    connect: { id: data.statusId },
                },
                confirmedAt: data.confirmedAt,
                orderItems: {
                    create: data.orderItems,
            },
            include: { 
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
    }});
        return this.mapOrderItems([createdOrder]);
    }
    

    async update(id: string, data: OrderDTO) {
        await this.prisma.orderItem.deleteMany({
            where: {
                orderId: id,
            },
        });

        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: {
                user: {
                    connect: { id: data.userId },
                },
                status: {
                    connect: { id: data.statusId },
                },
                confirmedAt: data.confirmedAt,
                orderItems: {
                    create: data.orderItems,
                },
            },
            include: { 
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return this.mapOrderItems([updatedOrder]);
    }

}
