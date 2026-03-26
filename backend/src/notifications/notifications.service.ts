import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async findAll(userId: number) {
        return this.prisma.notification.findMany({
            where: {
                OR: [{ userId: null }, { userId }]
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: { title: string; message: string; userId?: number }) {
        return this.prisma.notification.create({ data });
    }
}
