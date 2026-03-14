import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Migrating old users to profileComplete = true...');
    const result = await prisma.user.updateMany({
        where: { profileComplete: false },
        data: { profileComplete: true },
    });
    console.log(`Updated ${result.count} legacy users.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
