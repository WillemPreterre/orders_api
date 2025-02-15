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
    private client: ClientProxy;

    constructor(@InjectModel(OrderEntity.name) private readonly orderModel: Model<OrderEntity>) {

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

    sendMessage(data: any) {
        return this.client.send('orders_retrieved', data);
    }
    // Création à chaque étape du swagger avec sa méthode et ses infos
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle commande' })
    @ApiResponse({ status: 201, description: 'La commande a été créée avec succès.' })
    @ApiResponse({ status: 400, description: 'Requête invalide.' })
    @ApiBody({ type: CreateOrderDto })
    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const order = this.orderModel.create(createOrderDto);
        const a = this.client.send('orders_retrieved', order)
  
        return order
    }


    @Get()
    @UseGuards(AuthGuard('jwt')) // Protection de la route avec un token JWT
    @ApiOperation({ summary: 'Récupérer toutes les commandes' })
    @ApiResponse({ status: 200, description: 'Liste des commandes récupérée avec succès.' })
    async findAll(): Promise<OrderEntity[]> {
        // Récupération de toutes les commandes avec `await`
        const orders = await this.orderModel.find().lean().exec();
    
        if (orders.length > 0) {
            // Envoie du premier ID trouvé à RabbitMQ
            this.sendMessage({ orderId: orders[0]._id });
        }
    
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
        return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).lean().exec();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une commande' })
    @ApiResponse({ status: 200, description: 'Commande supprimée avec succès.' })
    @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
    @ApiParam({ name: 'id', description: 'ID de la commande', type: String })
    async remove(id: string): Promise<OrderEntity | null> {
        // Suppression d'une commande par son ID
        return this.orderModel.findByIdAndDelete(id).lean().exec();
    }
}
