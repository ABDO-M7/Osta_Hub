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
}
