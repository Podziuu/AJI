import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const mockCategoriesService = {
      findAll: jest.fn().mockResolvedValue([{id: 1, name: 'Category 1'}, {id: 2, name: 'Category 2'}])
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesController,
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ]);
  });

  it('should call findAll from CategoriesService', async () => {
    const spy = jest.spyOn(service, 'findAll');
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  })
});
