import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatusService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: mockStatusService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock AuthGuard as always successful
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock RolesGuard as always successful
      .compile();

    controller = module.get<StatusController>(StatusController);
    service = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call StatusService.findAll and return the result', async () => {
      const mockStatuses = [
        { id: '1', status: 'Pending' },
        { id: '2', status: 'Shipped' },
      ];
      mockStatusService.findAll.mockResolvedValue(mockStatuses);

      const result = await controller.findAll();

      expect(result).toEqual(mockStatuses);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no statuses are found', async () => {
      mockStatusService.findAll.mockResolvedValue([]);

      try {
        await controller.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No statuses found');
      }
    });
  });
});
