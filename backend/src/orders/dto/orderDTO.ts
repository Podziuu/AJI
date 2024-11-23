import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';
import { CreateAndUpdateProductDto } from 'src/products/dto/createProductDto';

export class OrderDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsDateString() 
  createdAt: string; 

  @IsOptional()  
  @IsDateString() 
  confirmedAt?: string;

  @IsNotEmpty()
  @IsString()
  statusId: string;

//   @IsArray()
//   orderItems: CreateAndUpdateProductDto[];
}
