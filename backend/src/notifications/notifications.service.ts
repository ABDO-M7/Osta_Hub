import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: { title: string; message: string }) {
        return this.prisma.notification.create({ data });
    }
}
