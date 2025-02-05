import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID de la commande',
        required: true,
    })
    @IsUUID('4', { message: 'L\'ID de la commande doit être un UUID valide' })
    orderId: string;

    @ApiProperty({ example: '12345', description: 'ID du client' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ type: [ProductDto], description: 'Liste des produits commandés' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];

    @ApiProperty({ example: 50.99, description: 'Montant total de la commande' })
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;

    @ApiProperty({ example: '', description: 'Statut de la commande' })
    @IsString()
    @IsNotEmpty()
    status: string;
}