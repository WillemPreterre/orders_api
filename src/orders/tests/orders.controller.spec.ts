import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder = {
    orderId: '123e4567-e89b-12d3-a456-426614174000',
    customerId: '12345',
    products: [{ productId: 'produit1', quantity: 2 }],
    totalAmount: 50.99,
    status: 'En cours',
  };

  const mockOrdersService = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findAll: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue({ ...mockOrder, status: 'Terminé' }),
    remove: jest.fn().mockResolvedValue({ message: 'Commande Supprimé' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot({
        throttlers: [
          {
            name: 'default',
            ttl: 60,
            limit: 10,
          },
        ],
      })
      ],
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },

        {
          provide: 'THROTTLER:MODULE_OPTIONS',
          useValue: { ttl: 60, limit: 10 },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('Défini le controller', () => {
    expect(controller).toBeDefined();
  });

  it('Créer une commande', async () => {
    const dto: CreateOrderDto = {
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      customerId: '12345',
      products: [{ productId: 'prod1', quantity: 2 }],
      totalAmount: 50.99,
      status: 'pending',
    };
    expect(await controller.create(dto)).toEqual(mockOrder);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('Récupére toutes les commandes', async () => {
    expect(await controller.findAll()).toEqual([mockOrder]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('Récupére une commande par ID', async () => {
    expect(await controller.findOne('123e4567-e89b-12d3-a456-426614174000')).toEqual(mockOrder);
    expect(service.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
  });

  it('Supprime une commande', async () => {
    expect(await controller.remove('123e4567-e89b-12d3-a456-426614174000')).toEqual({ message: 'Commande Supprimé' });
    expect(service.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
  });
});