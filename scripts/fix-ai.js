const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAi() {
  try {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        geminiApiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY',
        geminiModel: 'gemini-3.8-flash'
      }
    });
    console.log("AI Config updated successfully.");
  } finally {
    await prisma.$disconnect();
  }
}

fixAi();
