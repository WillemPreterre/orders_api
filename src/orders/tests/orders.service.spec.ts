import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { ClientProxy } from '@nestjs/microservices';

import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { getModelToken } from '@nestjs/mongoose';
import { OrderEntity } from '../entitites/order.entity';
import { OrdersController } from '../orders.controller';
describe('OrdersService', () => {
    // Déclaration des variables
    let service: OrdersService;
    let client: ClientProxy;
    const mockOrder = {
        _id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '12345',
        items: ['67cd7eade42a44b0a158931a'],
        totalAmount: 50.99,
        status: 'En cours',
    };
    // Mock de la méthode lean() et exec() de Mongoose
    const mockExec = (data) => ({
        lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(data),
        }),
    });
    // Mock du modèle Order
    const mockOrderModel = {
        create: jest.fn().mockResolvedValue(mockOrder),
        find: jest.fn().mockReturnValue(mockExec([mockOrder])),
        findById: jest.fn().mockImplementation((id) => mockExec(id === mockOrder._id ? mockOrder : null)),
        findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => mockExec(id === mockOrder._id ? { ...mockOrder, ...dto } : null)),
        findByIdAndDelete: jest.fn().mockImplementation((id) => mockExec(id === mockOrder._id ? mockOrder : null)),
    };

    // Création du module de test
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            controllers: [OrdersController],
            providers: [
                OrdersService,
                {
                    provide: getModelToken(OrderEntity.name),
                    useValue: mockOrderModel,
                },
                {
                    provide: 'PROM_METRIC_ORDERS_REQUESTS_TOTAL', // 💡 Mock de la métrique Prometheus
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

        service = module.get<OrdersService>(OrdersService);
        client = module.get<ClientProxy>('RABBITMQ_SERVICE');
    });

    it('Défini', () => {
        expect(service).toBeDefined();
    });

    // Test de la méthode create
    it('Créer une commande', async () => {
        const createOrderDto: CreateOrderDto = {
            _id: '123e4567-e89b-12d3-a456-426614174000',
            customerId: '12345',
            items: ["67cd7eade42a44b0a158931a"],
            totalAmount: 50.99,
            status: 'En cours',
        };
    
        const result = await service.create(createOrderDto);
    
        expect(result).toEqual(mockOrder);
        expect(mockOrderModel.create).toHaveBeenCalledWith(createOrderDto);
    
        expect(client.emit).toHaveBeenCalledTimes(1); // Ensure emit is called once
        expect(client.emit).toHaveBeenCalledWith('order_retrieved', mockOrder);
    });
    
    // Test de la méthode findAll
    describe('Trouver toutes les commandes', () => {
        it('Retourne toutes les commandes', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockOrder]); // Vérifie que le résultat est égal à la commande mockée
            expect(mockOrderModel.find).toHaveBeenCalled();
        });
    });
    // Test de la méthode findOne
    describe('Trouver une commande', () => {
        it('Retourne une commande', async () => {
            const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toEqual(mockOrder);
            expect(mockOrderModel.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000'); // Vérifie que la méthode findById a été appelée avec l'ID de la commande
        });

        it('Retourne null si non trouvé', async () => {
            const result = await service.findOne('invalidId');
            expect(result).toBeNull();
            expect(mockOrderModel.findById).toHaveBeenCalledWith('invalidId');
        });
    });
    // Test de la méthode update
    describe('Modifie une commande', () => {
        it('Update une commande', async () => {
            const updateOrderDto: UpdateOrderDto = { _id: '123e4567-e89b-12d3-a456-426614174000', status: "Terminé" };
            const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateOrderDto);
            expect(result).toEqual({ ...mockOrder, ...updateOrderDto });
            expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateOrderDto, { new: true });
        });
        // Test de la méthode update si l'ID est invalide
        it('Retourne null si non trouvé', async () => {
            const updateOrderDto: UpdateOrderDto = { _id: '123e4567-e89b-12d3-a456-426614174000', status: "Terminé" };
            const result = await service.update('invalidId', updateOrderDto);
            expect(result).toBeNull();
            expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith('invalidId', updateOrderDto, { new: true });
        });
    });
    // Test de la méthode remove
    describe('Supprime une commande', () => {
        it('Supprime une commande', async () => {
            const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toEqual(mockOrder);
            expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
        });
        // Test de la méthode remove si l'ID est invalide
        it('Retourne null si non trouvé', async () => {
            const result = await service.remove('invalidId');
            expect(result).toBeNull();
            expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith('invalidId');
        });
    });
});