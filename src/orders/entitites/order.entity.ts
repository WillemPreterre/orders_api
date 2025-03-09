import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Interface représentant une commande

export interface Order extends Document {
  _id: Types.ObjectId; // Ajout du _id
  products: string[];
  totalAmount: number;
  status: 'En cours' | 'Terminé';
  createdAt: Date;
  updatedAt: Date;
}


@Schema({ timestamps: true }) // Active la gestion automatique des dates de création et de mise à jour
export class OrderEntity {

  _id: string;

  @Prop([String]) // Définit un tableau de chaînes de caractères pour les articles commandés
  items: string[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  customerId: string;

  @Prop({ enum: ['En cours', 'Terminé'], default: 'En cours' }) // Définit le statut avec des valeurs prédéfinies
  status: 'En cours' | 'Terminé';

  @Prop({ default: Date.now }) // Définit la date de création par défaut
  createdAt: Date;

  @Prop({ default: Date.now }) 
  updatedAt: Date;
}

// Génère le schéma mongoose correspondant à l'entité OrderEntity
export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
