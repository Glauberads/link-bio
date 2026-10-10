const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('Systems:', await prisma.systemProduct.findMany());
  console.log('Projects:', await prisma.project.findMany());
  console.log('Resources:', await prisma.resource.findMany());
}
main().catch(console.error).finally(() => prisma.$disconnect());
