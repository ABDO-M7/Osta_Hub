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

    async findByProviderId(provider: string, providerId: string) {
        return this.prisma.user.findFirst({ where: { provider, providerId } });
    }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({ where: { username } });
    }

    async findByVerifyToken(token: string) {
        return this.prisma.user.findFirst({ where: { emailVerifyToken: token } });
    }

    async create(data: {
        email: string;
        password?: string | null;
        name: string;
        role?: string;
        provider?: string;
        providerId?: string;
        avatar?: string;
        emailVerified?: boolean;
    }) {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password || null,
                name: data.name,
                role: (data.role as Role) || Role.STUDENT,
                provider: data.provider,
                providerId: data.providerId,
                avatar: data.avatar,
                emailVerified: data.emailVerified || false,
            },
        });

        // Send a welcome notification into the global feed
        try {
            await this.prisma.notification.create({
                data: {
                    title: `🎉 Welcome to NeuroTron, ${user.name.split(' ')[0]}!`,
                    message: `We're thrilled to have you on board. Explore your course catalog, start learning, and track your progress — your journey begins now. Good luck! 🚀`,
                }
            });
        } catch (_) { /* non-blocking */ }

        return user;
    }

    async linkOAuth(userId: number, provider: string, providerId: string, avatar?: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { provider, providerId, avatar },
        });
    }

    async updateProfile(userId: number, data: {
        username: string;
        phone: string;
        level: string;
        specialization: string;
        profileComplete: boolean;
    }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async updateUserDetails(userId: number, data: {
        name?: string;
        level?: string;
        specialization?: string;
        avatar?: string;
    }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async setVerifyToken(userId: number, token: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { emailVerifyToken: token },
        });
    }

    async markEmailVerified(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true, emailVerifyToken: null },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true, username: true, avatar: true },
        });
    }

    async getEnrollments(userId: number) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            include: { subject: { include: { lessons: { select: { id: true } } } } },
            orderBy: { updatedAt: 'desc' },
        });

        // Dynamically compute progress for each enrollment
        const result = await Promise.all(enrollments.map(async (enr) => {
            const totalLessons = enr.subject.lessons.length;
            if (totalLessons === 0) return { ...enr, progress: 0 };

            const completedCount = await this.prisma.lessonProgress.count({
                where: { userId, completed: true, lesson: { subjectId: enr.subjectId } }
            });
            const dynamicProgress = Math.round((completedCount / totalLessons) * 100 * 10) / 10;

            // Also persist the updated value so dashboard is correct
            if (Math.abs(dynamicProgress - enr.progress) > 0.5) {
                await this.prisma.enrollment.updateMany({
                    where: { userId, subjectId: enr.subjectId },
                    data: { progress: dynamicProgress }
                });
            }

            return { ...enr, progress: dynamicProgress };
        }));

        return result;
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

        const bestScore = completedAttempts.length > 0 
            ? Math.max(...completedAttempts.map(a => a.score || 0)) 
            : 0;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { currentStreak: true }
        });

        const completedLessons = await this.prisma.lessonProgress.count({
            where: { userId, completed: true }
        });

        return {
            totalAttempts,
            completedAttempts: completedAttempts.length,
            averageScore: Math.round(averageScore * 100) / 100,
            bestScore: Math.round(bestScore * 100) / 100,
            recentAttempts: attempts.slice(0, 5),
            completedLessons,
            streakDays: user?.currentStreak || 0
        };
    }
}
