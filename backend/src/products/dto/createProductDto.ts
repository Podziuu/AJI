import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAndUpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
  @IsNumber()
  @Min(1)
  price: number;
  @IsNumber()
  @Min(1)
  weight: number;
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
