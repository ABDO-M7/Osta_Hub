import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getProfile(@Request() req: any) {
        const user = await this.usersService.findById(req.user.id);
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
    }

    @Get('me/stats')
    async getMyStats(@Request() req: any) {
        return this.usersService.getStudentStats(req.user.id);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async findAll() {
        return this.usersService.findAll();
    }
}
