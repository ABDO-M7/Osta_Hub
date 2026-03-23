import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
    @IsString()
    message: string;

    @IsNumber()
    rating: number;
}
