import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    category: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all categories', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];
    mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

    const result = await service.findAll();
    expect(result).toEqual(mockCategories);
  });

  it('should call findMany of PrismaService', async () => {
    const spy = jest.spyOn(prismaService.category, 'findMany');
    await service.findAll();
    expect(spy).toHaveBeenCalled();
  })
});
