import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    return this.appService.handleOrderCreated(data);
  }

  @MessagePattern('order_retrieved')
  handleOrderRetrieved(@Payload() data: any) {
    return this.appService.handleOrderRetrieved(data);
  }
}
