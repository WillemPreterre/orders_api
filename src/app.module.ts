import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [MongooseModule.forRoot(
    'mongodb://localhost:27017/orders_db'),
    OrdersModule,],

  controllers: [AppController, OrdersController],
  providers: [AppService],

})
export class AppModule { }
