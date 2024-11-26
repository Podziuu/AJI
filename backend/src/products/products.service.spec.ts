import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { CreateAndUpdateProductDto } from './dto/createProductDto';
import { OpenAiService } from './openai.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;
  let openaiService: OpenAiService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockOpenAiService = {
    generateSeoDescription: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: OpenAiService,
          useValue: mockOpenAiService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
    openaiService = module.get<OpenAiService>(OpenAiService);
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

  describe('getSeoDescription', () => {
    it('should call OpenAiService.generateSeoDescription and return description', async () => {
      const product = { id: '1', name: 'Laptop', description: 'Wspanialy laptop do nauki', price: 2999, weight: 699, category: { name: 'Electronics' } };
      const seoDescription = 'SEO description for Laptop in Electronics category';
      
      mockPrismaService.product.findUnique.mockResolvedValue(product);
      mockOpenAiService.generateSeoDescription.mockResolvedValue(seoDescription);

      expect(await service.getSeoDescription('1')).toEqual(seoDescription);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { category: true } });
      expect(openaiService.generateSeoDescription).toHaveBeenCalledWith({
        name: product.name,
        category: product.category.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.getSeoDescription('1')).rejects.toThrow(NotFoundException);
    });
  });
});
