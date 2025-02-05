import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsOptional() 
  products?: ProductDto[];

  @IsNumber()
  @IsOptional() 
  totalAmount?: number;

  @IsString()
  @IsOptional()
  status?: string;
}