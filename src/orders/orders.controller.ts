import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { ClientProxy, ClientProxyFactory, EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';


@Controller('orders') // Définit le chemin d'accès pour ce contrôleur
export class OrdersController {
  private client: ClientProxy;

  constructor(

    private readonly ordersService: OrdersService,
    @InjectMetric('orders_requests_total') private readonly ordersRequestsTotal: Counter,

  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'orders_retrieved',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  // RabbitMq
  @MessagePattern('orders_retrieved') // Correspond au nom de la queue RabbitMQ
  async handleMessage(@Payload() data: any) {
    console.log('Received message:', data);
    return { response: `Message reçu: ${JSON.stringify(data)}` };
  }

  @Post()
  @UseGuards(JwtAuthGuard)

  async create(@Body() createOrderDto: CreateOrderDto) {
    // Crée une nouvelle commande
    const order = this.ordersService.create(createOrderDto);
    this.ordersRequestsTotal.inc();
    this.client.emit('orders_retrieved', order);

    return order

  }
  @Get('send')
  async sendMessage() {
    const response = await this.ordersService.sendMessage({ text: 'Hello RabbitMQ!' }).toPromise();
    return response;
  }
  @Get()
  @UseGuards(JwtAuthGuard)

  async findAll() {
    this.ordersRequestsTotal.inc();

    // Récupère toutes les commandes
    const orders = await this.ordersService.findAll();
    this.client.emit('orders_retrieved', orders);
    return orders;

  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)

  async findOne(@Param('id') id: string) {
   const order = this.ordersRequestsTotal.inc();
    this.client.emit('orders_retrieved', order);

    // Récupère une commande par son ID
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)

  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const order = this.ordersRequestsTotal.inc();
    this.client.emit('orders_retrieved', order);

    // Met à jour une commande existante
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)

  async remove(@Param('id') id: string) {
    const order = this.ordersRequestsTotal.inc();
    this.client.emit('orders_retrieved', order);

    // Supprime une commande par son ID
    return this.ordersService.remove(id);
  }

}
