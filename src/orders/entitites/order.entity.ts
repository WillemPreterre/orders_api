import { Schema, Document } from 'mongoose';

export const OrdersSchema = new Schema({
    date_orders: { type: Date, default: Date.now },
    statut: { type: String, required: true },
    id_client: { type: String, required: true },
    total: { type: Number, required: true },
    produits: [
        {
            id_produit: { type: String, required: true },
            quantite: { type: Number, required: true },
        },
    ],
});

export interface orders extends Document {
    date_orders: Date;
    statut: string;
    id_client: string;
    total: number;
    produits: { id_produit: string; quantite: number }[];
}