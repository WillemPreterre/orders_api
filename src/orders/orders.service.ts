import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entitites/order.entity';

@Injectable()
export class OrdersService {
    constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const createdOrder = new this.orderModel(createOrderDto);
        return createdOrder.save();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().lean().exec();
    }

    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).lean().exec();
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
        return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).lean().exec();
    }

    async remove(id: string): Promise<Order | null> {
        return this.orderModel.findByIdAndDelete(id).lean().exec();
    }

}