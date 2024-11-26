import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class reviewDTO {
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}