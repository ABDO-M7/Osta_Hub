import { IsString, IsOptional, MinLength } from 'class-validator';

export class CompleteProfileDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    phone: string;

    @IsString()
    level: string;

    @IsString()
    specialization: string;
}
