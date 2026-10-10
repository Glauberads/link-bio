const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteConfig.update({ where: { id: 1 }, data: { geminiModel: 'gemini-2.5-flash' } }).then(() => console.log('UPDATED')).finally(() => prisma.$disconnect());
