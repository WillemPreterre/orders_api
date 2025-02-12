import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import {OrderEntity, OrderSchema } from './entitites/order.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: OrderEntity.name, schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],

})
export class OrdersModule {}
