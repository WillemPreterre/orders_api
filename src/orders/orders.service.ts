import { Delete, Get, Injectable, Post, Put, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entitites/order.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OrdersService {
    constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle commande' })
    @ApiResponse({ status: 201, description: 'La commande a été créée avec succès.' }) 
    @ApiResponse({ status: 400, description: 'Requête invalide.' })
    @ApiBody({ type: CreateOrderDto })
    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const createdOrder = new this.orderModel(createOrderDto);
        return createdOrder.save();
    }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Récupérer toutes les commandes' })
    @ApiResponse({ status: 200, description: 'Liste des commandes récupérée avec succès.' })
    async findAll(): Promise<Order[]> {
        return this.orderModel.find().lean().exec();
    }
    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une commande par son ID' })
    @ApiResponse({ status: 200, description: 'Commande récupérée avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).lean().exec();
    }
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une commande' })
    @ApiResponse({ status: 200, description: 'Commande mise à jour avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    @ApiBody({ type: UpdateOrderDto }) // Spécifie le type de body attendu
    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
        return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).lean().exec();
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une commande' })
    @ApiResponse({ status: 200, description: 'Commande supprimée avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    async remove(id: string): Promise<Order | null> {
        return this.orderModel.findByIdAndDelete(id).lean().exec();
    }

}