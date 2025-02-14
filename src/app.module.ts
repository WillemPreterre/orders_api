import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import * as dotenv from 'dotenv';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config();

@Module({
  imports: [
    
    AuthModule,

    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ordersapi.txp8c.mongodb.net/?retryWrites=true&w=majority&appName=ordersApi`
    ),
    
    OrdersModule,
    
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }