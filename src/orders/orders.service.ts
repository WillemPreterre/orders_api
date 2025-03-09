import { Delete, Get, Inject, Injectable, Post, Put, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderEntity } from "./entitites/order.entity";
import { Model } from "mongoose";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class OrdersService {
    // Injection du modèle OrderEntity pour interagir avec MongoDB

    constructor(
        @InjectModel(OrderEntity.name) private readonly orderModel: Model<OrderEntity>,
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    ) { }


    // Création à chaque étape du swagger avec sa méthode et ses infos
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle commande' })
    @ApiResponse({ status: 201, description: 'La commande a été créée avec succès.' })
    @ApiResponse({ status: 400, description: 'Requête invalide.' })
    @ApiBody({ type: CreateOrderDto })
    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const order = await this.orderModel.create(createOrderDto);
        this.client.emit('order_retrieved', order);
        return order;
    }

    @Get()
    @UseGuards(AuthGuard('jwt')) // Protection de la route avec un token JWT
    @ApiOperation({ summary: 'Récupérer toutes les commandes' })
    @ApiResponse({ status: 200, description: 'Liste des commandes récupérée avec succès.' })
    async findAll(): Promise<OrderEntity[]> {
        // Récupération de toutes les commandes avec `await`
        const orders = await this.orderModel.find().lean().exec();

        return orders;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une commande par son ID' })
    @ApiResponse({ status: 200, description: 'Commande récupérée avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    async findOne(id: string): Promise<OrderEntity | null> {
        console.log("findOne Id:", id); // Log de l'ID pour debug
        const result = await this.orderModel.findById(id).lean().exec();
        console.log("findOne result:", result); // Log du résultat pour debug

        return result;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une commande' })
    @ApiResponse({ status: 200, description: 'Commande mise à jour avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    @ApiBody({ type: UpdateOrderDto })
    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity | null> {
        // Mise à jour d'une commande existante
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).lean().exec();

        return updatedOrder;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une commande' })
    @ApiResponse({ status: 200, description: 'Commande supprimée avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    async remove(id: string): Promise<OrderEntity | null> {
        // Suppression d'une commande par son ID
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).lean().exec();

        return deletedOrder;
    }
}
