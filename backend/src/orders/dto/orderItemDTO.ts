import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderItemDTO {
    @IsString()
    @IsNotEmpty()
    productId: string;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}