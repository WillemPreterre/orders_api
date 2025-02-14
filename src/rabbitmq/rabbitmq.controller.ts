import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    console.log('🟢 Nouveau message RabbitMQ reçu :', data);
  }
}
