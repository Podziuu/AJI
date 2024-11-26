// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma.service';
import { ChangeOrderStatusDTO } from './dto/changeOrderStatusDTO';
import { OrderDTO } from './dto/orderDTO';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    orderStatus: {
      findUnique: jest.fn(),
    },
    orderItem: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of orders', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          status: { name: 'Pending' },
          orderItems: [{ id: 'item-1', quantity: 1, product: { name: 'Product 1' } }],
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findAll();
      expect(result).toEqual([
        {
          id: 'order-1',
          status: { name: 'Pending' },
          orderItems: [{ id: 'item-1', quantity: 1, product: { name: 'Product 1' } }],
        },
      ]);
    });
  });

  describe('findByUserId', () => {
    it('should return orders by user id', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: { name: 'Completed' },
          orderItems: [{ id: 'item-1', quantity: 1, product: { name: 'Product 1' } }],
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.findByUserId('user-1');
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 'order-1',
        status: { name: 'Pending' },
        orderItems: [{ id: 'item-1', quantity: 1, product: { name: 'Product 1' } }],
      };

      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findById('order-1');
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('changeStatus', () => {
    it('should change the status of an order', async () => {
      const mockOrder = {
        id: 'order-1',
        status: { name: 'Shipped' },
        orderItems: [{ id: 'item-1', quantity: 1, product: { name: 'Product 1' } }],
      };

      const changeOrderStatusDTO: ChangeOrderStatusDTO = { value: 'Shipped' };
      mockPrismaService.orderStatus.findUnique.mockResolvedValue({ id: 'status-1' });
      mockPrismaService.order.update.mockResolvedValue(mockOrder);

      const result = await service.changeStatus('order-1', changeOrderStatusDTO);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const orderDTO: OrderDTO = {
        userId: 'user-1',
        statusId: 'status-1',
        confirmedAt: new Date(),
        orderItems: [
          {
            productId: 'product-1',
            quantity: 2,
          },
        ],
      };

      const mockOrder = {
        id: 'order-1',
        status: { name: 'Pending' },
        orderItems: [{ id: 'item-1', quantity: 2, product: { name: 'Product 1' } }],
      };

      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create(orderDTO);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const orderDTO: OrderDTO = {
        userId: 'user-1',
        statusId: 'status-1',
        confirmedAt: new Date(),
        orderItems: [
          {
            productId: 'product-1',
            quantity: 3,
          },
        ],
      };

      const mockOrder = {
        id: 'order-1',
        status: { name: 'Pending' },
        orderItems: [{ id: 'item-1', quantity: 3, product: { name: 'Product 1' } }],
      };

      mockPrismaService.orderItem.deleteMany.mockResolvedValue({});
      mockPrismaService.order.update.mockResolvedValue(mockOrder);

      const result = await service.update('order-1', orderDTO);
      expect(result).toEqual([mockOrder]);
    });
  });
});
