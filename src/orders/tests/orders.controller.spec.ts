import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let client: ClientProxy;

  const mockOrder = {
    _id: '123e4567-e89b-12d3-a456-426614174000',
    customerId: '12345',
    items: ['67cd7eade42a44b0a158931a'],
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
      imports: [],
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
        {
          provide: 'PROM_METRIC_ORDERS_REQUESTS_TOTAL', 
          useValue: {
              inc: jest.fn(), // Simule la méthode `inc()` de Prometheus
          },
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
      
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    client = module.get<ClientProxy>('RABBITMQ_SERVICE');
  });

  it('Défini le controller', () => {
    expect(controller).toBeDefined();
  });

  it('Créer une commande', async () => {
    const dto: CreateOrderDto = {
      _id: '123e4567-e89b-12d3-a456-426614174000',
      customerId: '12345',
      items: ["67cd7eade42a44b0a158931a"],
      totalAmount: 50.99,
      status: 'en cours',
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