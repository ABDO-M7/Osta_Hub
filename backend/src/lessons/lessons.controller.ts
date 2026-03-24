import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
    constructor(private lessonsService: LessonsService) { }

    @Get()
    findAll(@Query('subjectId') subjectId?: string) {
        return this.lessonsService.findAll(subjectId ? parseInt(subjectId) : undefined);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateLessonDto) {
        return this.lessonsService.create(dto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
        return this.lessonsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.remove(id);
    }

    @Post(':id/complete')
    @UseGuards(AuthGuard('jwt'))
    markComplete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.lessonsService.markComplete(id, req.user.id);
    }

    @Get(':id/notes')
    @UseGuards(AuthGuard('jwt'))
    getNote(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.lessonsService.getNote(id, req.user.id);
    }

    @Post(':id/notes')
    @UseGuards(AuthGuard('jwt'))
    saveNote(@Param('id', ParseIntPipe) id: number, @Body('content') content: string, @Request() req: any) {
        return this.lessonsService.saveNote(id, req.user.id, content);
    }
}
