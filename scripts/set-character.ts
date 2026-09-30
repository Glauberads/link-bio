import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { characterUrl: '/character.mp4' },
    create: { id: 1, characterUrl: '/character.mp4' }
  });
  console.log("Configuração atualizada para usar character.mp4!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
