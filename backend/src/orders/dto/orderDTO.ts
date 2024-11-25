import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';
import { OrderItemDTO } from './orderItemDTO';

export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()  
  @IsDateString() 
  confirmedAt?: string;

  @IsNotEmpty()
  @IsString()
  statusId: string;

  @IsArray()
  orderItems: OrderItemDTO[];
}
