import { Module } from '@nestjs/common';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { AiGradingModule } from '../ai-grading/ai-grading.module';

@Module({
    imports: [AiGradingModule],
    controllers: [AttemptsController],
    providers: [AttemptsService],
})
export class AttemptsModule { }
