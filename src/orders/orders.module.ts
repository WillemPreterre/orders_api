import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderEntity, OrderSchema } from './entitites/order.entity';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    PrometheusModule.register(),
    MongooseModule.forFeature([{ name: OrderEntity.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Change if needed
          queue: 'order_retrieved',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    // Crée un compteur Prometheus pour les requêtes sur /orders Prometheus
    makeCounterProvider({
      name: 'orders_requests_total',
      help: 'Nombre total de requêtes sur /orders',
    }),
  ],
  exports: [OrdersService],
})
export class OrdersModule { }
