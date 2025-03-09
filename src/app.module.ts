import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';

dotenv.config();

@Module({
  imports: [
    
    AuthModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ordersapi.txp8c.mongodb.net/?retryWrites=true&w=majority&appName=ordersApi`
    ),

    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }