import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AttemptsService } from './attempts.service';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';

@Controller('attempts')
@UseGuards(AuthGuard('jwt'))
export class AttemptsController {
    constructor(private attemptsService: AttemptsService) { }

    @Post('start/:examId')
    startAttempt(@Param('examId', ParseIntPipe) examId: number, @Request() req: any) {
        return this.attemptsService.startAttempt(examId, req.user.id);
    }

    @Post(':id/submit')
    submitAttempt(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: SubmitAttemptDto,
        @Request() req: any,
    ) {
        return this.attemptsService.submitAttempt(id, req.user.id, dto);
    }

    @Post(':id/analyze')
    analyzeAttempt(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        return this.attemptsService.analyzeAttempt(id, req.user.id);
    }

    @Get(':id')
    getAttempt(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.attemptsService.getAttempt(id, req.user.id);
    }

    @Get()
    getUserAttempts(@Request() req: any) {
        return this.attemptsService.getUserAttempts(req.user.id);
    }

    @Get('all/admin')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    getAllAttempts() {
        return this.attemptsService.getAllAttempts();
    }
}
