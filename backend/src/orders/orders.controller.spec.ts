// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrderDTO } from './dto/orderDTO';
import { ChangeOrderStatusDTO } from './dto/changeOrderStatusDTO';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    changeStatus: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: AuthGuard, useValue: mockAuthGuard },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          status: { name: 'Pending' },
          orderItems: [
            { id: 'item-1', quantity: 1, product: { name: 'Product 1' } },
          ],
        },
      ];

      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findByUserId', () => {
    it('should return orders by user id', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-1',
          status: { name: 'Completed' },
          orderItems: [
            { id: 'item-1', quantity: 1, product: { name: 'Product 1' } },
          ],
        },
      ];

      mockOrdersService.findByUserId.mockResolvedValue(mockOrders);

      const result = await controller.findByUserId('user-1');
      expect(result).toEqual(mockOrders);
    });
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      const mockOrder = {
        id: 'order-1',
        status: { name: 'Pending' },
        orderItems: [
          { id: 'item-1', quantity: 1, product: { name: 'Product 1' } },
        ],
      };

      mockOrdersService.findById.mockResolvedValue([mockOrder]);

      const result = await controller.findById('order-1');
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
        orderItems: [
          { id: 'item-1', quantity: 2, product: { name: 'Product 1' } },
        ],
      };

      mockOrdersService.create.mockResolvedValue([mockOrder]);

      const result = await controller.create(orderDTO);
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('changeOrderStatus', () => {
    it('should change the order status', async () => {
      const changeOrderStatusDTO: ChangeOrderStatusDTO = { value: 'Shipped' };

      const mockOrder = {
        id: 'order-1',
        status: { name: 'Shipped' },
        orderItems: [
          { id: 'item-1', quantity: 1, product: { name: 'Product 1' } },
        ],
      };

      mockOrdersService.changeStatus.mockResolvedValue([mockOrder]);

      const result = await controller.changeOrderStatus(
        'order-1',
        changeOrderStatusDTO,
      );
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('findByStatusId', () => {
    it('should return orders by status id', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          status: { name: 'Shipped' },
          orderItems: [
            { id: 'item-1', quantity: 1, product: { name: 'Product 1' } },
          ],
        },
      ];

      mockOrdersService.findByStatus.mockResolvedValue(mockOrders);

      const result = await controller.findByStatusId('status-1');
      expect(result).toEqual(mockOrders);
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
        orderItems: [
          { id: 'item-1', quantity: 3, product: { name: 'Product 1' } },
        ],
      };

      mockOrdersService.update.mockResolvedValue([mockOrder]);

      const result = await controller.update('order-1', orderDTO);
      expect(result).toEqual([mockOrder]);
    });
  });
});
