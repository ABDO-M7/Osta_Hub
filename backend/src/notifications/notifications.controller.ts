import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NotificationsService } from './notifications.service';
import { IsString } from 'class-validator';

class CreateNotificationDto {
    @IsString() title: string;
    @IsString() message: string;
}

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
        return this.notificationsService.findAll();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    create(@Body() body: CreateNotificationDto) {
        return this.notificationsService.create(body);
    }
}
