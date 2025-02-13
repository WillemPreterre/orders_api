import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('orders') // Définit le chemin d'accès pour ce contrôleur
@UseGuards(ThrottlerGuard) // Ajoute une protection contre les requêtes abusives
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    // Crée une nouvelle commande
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    // Récupère toutes les commandes
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Récupère une commande par son ID
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    // Met à jour une commande existante
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Supprime une commande par son ID
    return this.ordersService.remove(id);
  }
}
