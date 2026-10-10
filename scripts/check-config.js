const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    console.log(config);
  } finally {
    await prisma.$disconnect();
  }
}

checkConfig();
