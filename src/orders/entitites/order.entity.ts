import { Schema, Document } from 'mongoose';

export interface Order extends Document {
  items: string[];
  totalAmount: number;
  status: 'En cours' | 'Terminé';
  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderSchema = new Schema({
  items: [String],
  totalAmount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export class OrderEntity {}
