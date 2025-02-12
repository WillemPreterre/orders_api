import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface Order extends Document {
  items: string[];
  totalAmount: number;
  status: 'En cours' | 'Terminé';
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true }) 
export class OrderEntity {
  @Prop([String])
  items: string[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ enum: ['En cours', 'Terminé'], default: 'En cours' })
  status: 'En cours' | 'Terminé';

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
