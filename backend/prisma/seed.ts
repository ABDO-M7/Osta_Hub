import { PrismaClient, Role, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edtech.com' },
        update: {},
        create: {
            email: 'admin@edtech.com',
            password: adminPassword,
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });

    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.upsert({
        where: { email: 'student@edtech.com' },
        update: {},
        create: {
            email: 'student@edtech.com',
            password: studentPassword,
            name: 'Jane Student',
            role: Role.STUDENT,
        },
    });

    // Create subjects
    const mathSubject = await prisma.subject.create({
        data: {
            name: 'Machine Learning',
            description: 'Learn the fundamentals of machine learning, from linear regression to neural networks.',
            imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        },
    });

    const physicsSubject = await prisma.subject.create({
        data: {
            name: 'Physics',
            description: 'Explore mechanics, thermodynamics, and electromagnetism through interactive lessons.',
            imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
        },
    });

    // Create a lesson with blocks
    const lesson = await prisma.lesson.create({
        data: {
            title: 'Gradient Descent',
            subjectId: mathSubject.id,
            order: 1,
            blocks: {
                create: [
                    {
                        type: 'paragraph',
                        content: { text: 'Gradient Descent is an optimization algorithm used to minimize the cost function in machine learning models. It iteratively adjusts parameters by moving in the direction of steepest descent.' },
                        order: 1,
                    },
                    {
                        type: 'image',
                        content: { url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', alt: 'Gradient Descent Visualization' },
                        order: 2,
                    },
                    {
                        type: 'paragraph',
                        content: { text: 'The learning rate controls how big each step is. Too large and you may overshoot the minimum; too small and convergence will be very slow.' },
                        order: 3,
                    },
                    {
                        type: 'interactive-graph',
                        content: { config: { defaultLearningRate: 0.01, minRate: 0.001, maxRate: 1.0 } },
                        order: 4,
                    },
                    {
                        type: 'quiz',
                        content: {
                            question: 'What happens if the learning rate is too high?',
                            options: ['Convergence is guaranteed', 'The algorithm may overshoot the minimum', 'Training becomes faster', 'No effect'],
                            correctIndex: 1,
                        },
                        order: 5,
                    },
                ],
            },
        },
    });

    // Create an exam with questions
    const exam = await prisma.exam.create({
        data: {
            title: 'Machine Learning Fundamentals',
            subjectId: mathSubject.id,
            duration: 30,
            questions: {
                create: [
                    {
                        type: QuestionType.MCQ,
                        text: 'Which of the following is a supervised learning algorithm?',
                        options: JSON.stringify(['K-Means Clustering', 'Linear Regression', 'PCA', 'Autoencoder']),
                        correctAnswer: 'Linear Regression',
                        points: 10,
                        order: 1,
                    },
                    {
                        type: QuestionType.TRUE_FALSE,
                        text: 'Overfitting occurs when a model performs well on training data but poorly on unseen data.',
                        correctAnswer: 'true',
                        points: 5,
                        order: 2,
                    },
                    {
                        type: QuestionType.ESSAY,
                        text: 'Explain the bias-variance tradeoff in machine learning and why it matters for model selection.',
                        points: 20,
                        order: 3,
                    },
                ],
            },
        },
    });

    console.log('Seed data created successfully!');
    console.log({ admin: admin.email, student: student.email, subject: mathSubject.name, lesson: lesson.title, exam: exam.title });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
