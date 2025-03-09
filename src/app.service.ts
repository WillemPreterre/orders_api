import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor() {}

  @EventPattern('order_created')
  async handleOrderCreated(data: Record<string, unknown>) {
    console.log('Order created');
  }

  @EventPattern('order_retrieved')
  async handleOrderRetrieved(data: Record<string, unknown>) {
    console.log('Order retrieved');
  }
}
