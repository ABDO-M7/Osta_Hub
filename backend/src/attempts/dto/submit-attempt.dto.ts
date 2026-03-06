import { IsArray, ValidateNested, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
    @IsInt()
    questionId: number;

    @IsOptional()
    @IsString()
    response?: string;
}

export class SubmitAttemptDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}
