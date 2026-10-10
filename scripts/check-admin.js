const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.adminUser.findUnique({
    where: { email: 'glauberads21@gmail.com' }
  });
  console.log('User found:', user);
  if (user) {
    const isValid = await bcrypt.compare('cf39dce0-e7cf-4dc5-89d7-74024a1f13fc', user.passwordHash);
    console.log('Password valid:', isValid);
  }
}

main().finally(() => prisma.$disconnect());
