import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { CreateAndUpdateProductDto } from './dto/createProductDto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call PrismaService.product.create and return created product', async () => {
      const product: CreateAndUpdateProductDto = {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}
      const result = {id: '1', ...product};
      mockPrismaService.product.create.mockResolvedValue(result);

      expect(await service.create(product)).toEqual(result);
      expect(prisma.product.create).toHaveBeenCalledWith({data: product});
    })
  })

  describe('findById', () => {
    it('should call PrismaService.product.findUnique and return unique product', async () => {
      const product: CreateAndUpdateProductDto = {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}
      const result = {id: '1', ...product};

      mockPrismaService.product.findUnique.mockResolvedValue(result);

      expect(await service.findById('1')).toEqual(result);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({where: {id: '1'}});
    })
  })

  describe('findAll', () => {
    it('should call PrismaService.product.findAll and return all products', async () => {
      const productsList: CreateAndUpdateProductDto[] = [{name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}, {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}]
      const result = productsList.map((product: CreateAndUpdateProductDto, index: number) => {
        return {index, ...product}
      });
      mockPrismaService.product.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(prisma.product.findMany).toHaveBeenCalled();
    })
  })

  describe('update', () => {
    it('should call PrismaService.product.update and return updated product', async () => {
      const updatedProduct: CreateAndUpdateProductDto = {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}
      const result = {id: '1', ...updatedProduct};
      mockPrismaService.product.update.mockResolvedValue(result);

      expect(await service.update('1', updatedProduct)).toEqual(result);
      expect(prisma.product.update).toHaveBeenCalledWith({where: {id: '1'}, data: updatedProduct});
    })
  })
});
