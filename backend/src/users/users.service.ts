import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(data: { email: string; password: string; name: string; role?: string }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                role: (data.role as Role) || Role.STUDENT,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
    }

    async getStudentStats(userId: number) {
        const attempts = await this.prisma.attempt.findMany({
            where: { userId },
            include: { exam: { include: { subject: true } } },
            orderBy: { startedAt: 'desc' },
        });

        const totalAttempts = attempts.length;
        const completedAttempts = attempts.filter(a => a.submittedAt !== null);
        const averageScore = completedAttempts.length > 0
            ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
            : 0;

        return {
            totalAttempts,
            completedAttempts: completedAttempts.length,
            averageScore: Math.round(averageScore * 100) / 100,
            recentAttempts: attempts.slice(0, 5),
        };
    }
}
