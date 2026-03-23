import { Controller, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    async createFeedback(@Body() body: CreateFeedbackDto) {
        return this.feedbackService.createFeedback({
            message: body.message,
            rating: body.rating,
            userId: undefined // Public feedback
        });
    }
}
