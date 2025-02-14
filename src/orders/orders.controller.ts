import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { EventPattern } from '@nestjs/microservices';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';


@Controller('orders') // Définit le chemin d'accès pour ce contrôleur
@UseGuards(ThrottlerGuard) // Ajoute une protection contre les requêtes abusives
export class OrdersController {
  constructor(
    private readonly rabbitMQService: RabbitMQService,

    private readonly ordersService: OrdersService,
    @InjectMetric('orders_requests_total') private readonly ordersRequestsTotal: Counter,

  ) { }
  @Post()
  @UseGuards(JwtAuthGuard)

  async create(@Body() createOrderDto: CreateOrderDto) {
    // Crée une nouvelle commande
    const order = this.ordersService.create(createOrderDto);
    this.ordersRequestsTotal.inc();
    await this.rabbitMQService.sendOrderCreated(order);
    return order
    
  }

  @Get()
  @UseGuards(JwtAuthGuard)

  async findAll() {
    this.ordersRequestsTotal.inc();

    // Récupère toutes les commandes
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)

  async findOne(@Param('id') id: string) {
    this.ordersRequestsTotal.inc();

    // Récupère une commande par son ID
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)

  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    this.ordersRequestsTotal.inc();

    // Met à jour une commande existante
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)

  async remove(@Param('id') id: string) {
    this.ordersRequestsTotal.inc();

    // Supprime une commande par son ID
    return this.ordersService.remove(id);
  }

}
