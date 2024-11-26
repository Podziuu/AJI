//@ts-nocheck
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderDTO } from './dto/orderDTO';
import { PrismaService } from 'src/prisma.service';
import { ChangeOrderStatusDTO } from './dto/changeOrderStatusDTO';
import { reviewDTO } from './dto/reviewDTO';


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
                    review: true,
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
                review: true,
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
                review: true,
            },
        });
        return this.mapOrderItems([orders]);
    }

    async changeStatus(id: string, changeOrderStatusDTO: ChangeOrderStatusDTO) {
        const order = await this.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                status: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const validStatuses = ['CANCELLED', 'COMPLETED', 'CONFIRMED', 'PENDING'];

        if (!validStatuses.includes(changeOrderStatusDTO.value)) {
            throw new BadRequestException('Invalid order status');
        }

        if (order.status.name === 'CANCELLED') {
            throw new BadRequestException('Order has been cancelled and its status cannot be changed');
        }

        if (order.status.name === 'COMPLETED') {
            throw new BadRequestException('Order has been completed and its status cannot be changed');
        }

        if (order.status.name === 'CONFIRMED' && changeOrderStatusDTO.value === 'PENDING') {
            throw new BadRequestException('Order status cannot be changed from confirmed to pending');
        }

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
                review: true,
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
                review: true,
            },
        });
        return this.mapOrderItems(orders);
    }

    async create(data: OrderDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: data.userId,
            },
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        for (const orderItem of data.orderItems) {
            if (orderItem.quantity <= 0) {
                throw new BadRequestException('Quantity must be greater than 0');
            }

            const product = await this.prisma.product.findUnique({
                where: {
                    id: orderItem.productId,
                },
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }
        }

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
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
            review: true,
          },
        });
        return this.mapOrderItems([createdOrder]);
      }
    

    async update(id: string, data: OrderDTO) {
        const order = await this.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                status: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status.name === 'CANCELLED') {
            throw new BadRequestException('Order has been cancelled and cannot be updated');
        }

        if (order.status.name === 'COMPLETED') {
            throw new BadRequestException('Order has been completed and its status cannot be changed');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: data.userId,
            },
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        for (const orderItem of data.orderItems) {
            if (orderItem.quantity <= 0) {
                throw new BadRequestException('Quantity must be greater than 0');
            }

            const product = await this.prisma.product.findUnique({
                where: {
                    id: orderItem.productId,
                },
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }
        }

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
                confirmedAt: data.confirmedAt,
                orderItems: {
                    create: data.orderItems,
                },
            },
            include: { 
                status: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                review: true,
            },
        });
        return this.mapOrderItems([updatedOrder]);
    }

    async review(id: string, data: reviewDTO, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                status: true,
            },
        });

        if (order.userId !== userId) {
            throw new ForbiddenException('You are not allowed to review this order');
        }

        if (order.status.name !== 'CANCELLED' && order.status.name !== 'COMPLETED') {
            throw new BadRequestException('You can only review cancelled or completed orders');
        }

        const reviewedOrder = await this.prisma.review.create({
            data: {
                order: { connect: { id: id } }, 
                rating: data.rating,
                content: data.content,      
            },
        });
        return {
            id: reviewedOrder.id,
            rating: reviewedOrder.rating,
            content: reviewedOrder.content,
            orderId: reviewedOrder.orderId,
        };

    }

}
