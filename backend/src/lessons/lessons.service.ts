import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async findAll(subjectId?: number) {
        return this.prisma.lesson.findMany({
            where: subjectId ? { subjectId } : undefined,
            include: { blocks: { orderBy: { order: 'asc' } }, subject: true },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { blocks: { orderBy: { order: 'asc' } }, subject: true },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    async create(dto: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: {
                title: dto.title,
                subjectId: dto.subjectId,
                order: dto.order || 0,
                blocks: {
                    create: dto.blocks?.map((block, index) => ({
                        type: block.type,
                        content: block.content as any,
                        order: block.order ?? index,
                    })) || [],
                },
            },
            include: { blocks: true },
        });
    }

    async update(id: number, dto: UpdateLessonDto) {
        await this.findOne(id);

        // If blocks are provided, delete old blocks and create new ones
        if (dto.blocks) {
            await this.prisma.lessonBlock.deleteMany({ where: { lessonId: id } });
        }

        return this.prisma.lesson.update({
            where: { id },
            data: {
                title: dto.title,
                order: dto.order,
                blocks: dto.blocks ? {
                    create: dto.blocks.map((block, index) => ({
                        type: block.type,
                        content: block.content as any,
                        order: block.order ?? index,
                    })),
                } : undefined,
            },
            include: { blocks: { orderBy: { order: 'asc' } } },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.lesson.delete({ where: { id } });
    }

    async markComplete(lessonId: number, userId: number) {
        const lesson = await this.findOne(lessonId);
        
        // Upsert LessonProgress
        const progress = await this.prisma.lessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            update: { completed: true },
            create: { userId, lessonId, completed: true }
        });

        // Update overall Enrollment progress for the subject
        const subjectId = lesson.subjectId;
        const totalLessons = await this.prisma.lesson.count({ where: { subjectId } });
        
        const completedLessonsInSubject = await this.prisma.lessonProgress.count({
            where: {
                userId,
                completed: true,
                lesson: { subjectId }
            }
        });

        const progressPercent = totalLessons > 0 ? (completedLessonsInSubject / totalLessons) * 100 : 0;

        await this.prisma.enrollment.updateMany({
            where: { userId, subjectId },
            data: { progress: progressPercent }
        });

        // Handle streak logic
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            const now = new Date();
            const lastActivity = user.lastActivityDate;
            let currentStreak = user.currentStreak;
            let longestStreak = user.longestStreak;

            if (!lastActivity) {
                currentStreak = 1;
            } else {
                // Calculate simple diff in days using locale midnight
                const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const lastMidnight = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
                const diffTime = Math.abs(nowMidnight.getTime() - lastMidnight.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    currentStreak += 1;
                } else if (diffDays > 1) {
                    currentStreak = 1;
                }
            }
            if (currentStreak > longestStreak) longestStreak = currentStreak;

            await this.prisma.user.update({
                where: { id: userId },
                data: { currentStreak, longestStreak, lastActivityDate: now }
            });
        }

        return progress;
    }

    async getNote(lessonId: number, userId: number) {
        const note = await this.prisma.note.findFirst({
            where: { lessonId, userId }
        });
        return note || { content: '' };
    }

    async saveNote(lessonId: number, userId: number, content: string) {
        const existing = await this.prisma.note.findFirst({
            where: { lessonId, userId }
        });
        if (existing) {
            return this.prisma.note.update({
                where: { id: existing.id },
                data: { content }
            });
        } else {
            return this.prisma.note.create({
                data: { userId, lessonId, content }
            });
        }
    }
}
