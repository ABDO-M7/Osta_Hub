import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    level?: string;

    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}
