import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
    constructor(@Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy) { }

    async sendOrderCreated(order: any) {
        try {
            console.log("Message émis");

            return this.rabbitClient.emit('order_created', order); // Émettre un événement

        } catch (error) {
            console.log('❌ Erreur lors de l\'envoi de la commande à RabbitMQ :', error);
        }
    }
}
