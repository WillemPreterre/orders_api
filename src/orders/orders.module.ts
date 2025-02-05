import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Order, OrderSchema } from './entitites/order.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],

})
export class OrdersModule {}
