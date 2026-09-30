const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const prisma = new PrismaClient();
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  
  if (!config || !config.geminiApiKey) {
    console.log("No API Key found in DB");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "deep-research-preview-04-2026" });

  try {
    const result = await model.generateContent("Diga 'Olá, mundo!'");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("ERROR from Gemini API:", error);
  }

  await prisma.$disconnect();
}

test();
