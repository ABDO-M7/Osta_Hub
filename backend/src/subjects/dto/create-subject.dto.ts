import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tracks?: string[];

    @IsOptional()
    @IsInt()
    order?: number;
}
