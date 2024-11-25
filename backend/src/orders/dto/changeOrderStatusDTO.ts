import { IsNotEmpty, IsString } from "class-validator";


export class ChangeOrderStatusDTO {
    @IsString()
    @IsNotEmpty()
    op: string;

    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}