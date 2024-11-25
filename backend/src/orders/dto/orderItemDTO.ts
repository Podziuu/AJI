import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDTO {
    @IsString()
    @IsNotEmpty()
    productId: string;
    
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}