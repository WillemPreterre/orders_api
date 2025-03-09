import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// class ProductDto {
//     @IsString()
//     @IsNotEmpty()
//     productId: string;

//     @IsNumber()
//     @IsNotEmpty()
//     quantity: number;
// }

export class UpdateOrderDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID de la commande',
        required: true,
    })
    @IsUUID('4', { message: 'L\'ID de la commande doit être un UUID valide' }) 
    _id: string;

    @ApiProperty({ example: '12345', description: 'ID du client', required: false })
    @IsString()
    @IsOptional()
    customerId?: string;

    @ApiProperty({ description: 'Liste des produits commandés', required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    items?: Array<any>;

    @ApiProperty({ example: 50.99, description: 'Montant total de la commande', required: false })
    @IsNumber()
    @IsOptional()
    totalAmount?: number;

    @ApiProperty({ example: 'En cours', description: 'Statut de la commande', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}