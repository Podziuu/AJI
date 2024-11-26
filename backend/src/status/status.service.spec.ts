import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('StatusService', () => {
  let service: StatusService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    orderStatus: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call PrismaService.findMany and return the result', async () => {
      const mockOrderStatuses = [
        { id: '1', status: 'Pending' },
        { id: '2', status: 'Shipped' },
      ];
      mockPrismaService.orderStatus.findMany.mockResolvedValue(mockOrderStatuses);

      const result = await service.findAll();

      expect(result).toEqual(mockOrderStatuses);
      expect(prismaService.orderStatus.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no order statuses are found', async () => {
      mockPrismaService.orderStatus.findMany.mockResolvedValue([]);

      try {
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No statuses found');
      }
    });
  });
});
