import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders } from './orders';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, Orders]
})
export class OrdersModule {}
