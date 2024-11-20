import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateAndUpdateProductDto } from './dto/createProductDto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService
        }
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call ProductsService.findAll and return the array of results', async () => {
      const result = [{id: '1', name: 'Product 1'}, {id: '2', name: 'Product 2'}];
      mockProductsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    })
  })

  describe('findOne', () => {
    it('should call ProductsService.findOne and return one result', async () => {
      const result = {id: '1', name: 'Product 1'}
      mockProductsService.findById.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findById).toHaveBeenCalledWith('1');
    })
  })

  describe('create', () => {
    it('should call ProductsService.create and return created product', async () => {
      const product: CreateAndUpdateProductDto = {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}
      const result = {id: '1', ...product};
      mockProductsService.create.mockResolvedValue(result);

      expect(await controller.create(product)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(product);
    })
  })

  describe('update', () => {
    it('should call ProductsService.update and return updated product', async () => {
      const updatedProduct: CreateAndUpdateProductDto = {name: "Laptop", description: "Laptop do nauki", price: 2999, weight: 699, categoryId: '1'}
      mockProductsService.update.mockResolvedValue(updatedProduct);

      expect(await controller.update('1', updatedProduct)).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updatedProduct);
    })
  })
});
