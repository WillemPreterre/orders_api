import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';

import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderEntity } from '../entitites/order.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrdersController } from '../orders.controller';
describe('OrdersService', () => {
    let service: OrdersService;
    let model: Model<OrderEntity>;
    const mockOrder = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '12345',
        products: [{ productId: 'produit1', quantity: 2 }],
        totalAmount: 50.99,
        status: 'En cours',
    };


    const mockExec = (data) => ({
        lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(data),
        }),
    });

    const mockOrderModel = {
        create: jest.fn().mockResolvedValue(mockOrder),
        find: jest.fn().mockReturnValue(mockExec([mockOrder])),
        findById: jest.fn().mockImplementation((id) => mockExec(id === mockOrder.orderId ? mockOrder : null)),
        findByIdAndUpdate: jest.fn().mockImplementation((id, dto) => mockExec(id === mockOrder.orderId ? { ...mockOrder, ...dto } : null)),
        findByIdAndDelete: jest.fn().mockImplementation((id) => mockExec(id === mockOrder.orderId ? mockOrder : null)),
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
            })],
            controllers: [OrdersController],
            providers: [
                OrdersService,
                {
                    provide: getModelToken(OrderEntity.name),
                    useValue: mockOrderModel,
                },

            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
    });


    it('Défini', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('Créer une commande', async () => {
            const createOrderDto: CreateOrderDto = {
                orderId: '123e4567-e89b-12d3-a456-426614174000',
                customerId: '12345',
                products: [{ productId: 'prod123', quantity: 2 }],
                totalAmount: 50.99,
                status: 'En cours',
            };

            const result = await service.create(createOrderDto);

            expect(result).toEqual(mockOrder);

            expect(mockOrderModel.create).toHaveBeenCalledWith(createOrderDto);
        });
    });

    describe('findAll', () => {
        it('Retourne toutes les commandes', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockOrder]);
            expect(mockOrderModel.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('Retourne une commande', async () => {
            const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toEqual(mockOrder);
            expect(mockOrderModel.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
        });

        it('Retourne null si non trouvé', async () => {
            const result = await service.findOne('invalidId');
            expect(result).toBeNull();
            expect(mockOrderModel.findById).toHaveBeenCalledWith('invalidId');
        });
    });

    describe('update', () => {
        it('Update une commande', async () => {
            const updateOrderDto: UpdateOrderDto = { orderId: '123e4567-e89b-12d3-a456-426614174000', status: "Terminé" };
            const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateOrderDto);
            expect(result).toEqual({ ...mockOrder, ...updateOrderDto });
            expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateOrderDto, { new: true });
        });

        it('Retourne null si non trouvé', async () => {
            const updateOrderDto: UpdateOrderDto = { orderId: '123e4567-e89b-12d3-a456-426614174000', status: "Terminé" };
            const result = await service.update('invalidId', updateOrderDto);
            expect(result).toBeNull();
            expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith('invalidId', updateOrderDto, { new: true });
        });
    });

    describe('remove', () => {
        it('Supprime une commande', async () => {
            const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');
            expect(result).toEqual(mockOrder);
            expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
        });

        it('Retourne null si non trouvé', async () => {
            const result = await service.remove('invalidId');
            expect(result).toBeNull();
            expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith('invalidId');
        });
    });
});