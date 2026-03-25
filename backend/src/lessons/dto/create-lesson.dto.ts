import { IsString, IsInt, IsOptional, IsArray, ValidateNested, Allow } from 'class-validator';
import { Type } from 'class-transformer';

export class LessonBlockDto {
    @IsString()
    type: string;

    @Allow()
    content: any;

    @IsOptional()
    @IsInt()
    order?: number;
}

export class CreateLessonDto {
    @IsString()
    title: string;

    @IsInt()
    subjectId: number;

    @IsOptional()
    @IsInt()
    order?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    topics?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LessonBlockDto)
    blocks?: LessonBlockDto[];
}
