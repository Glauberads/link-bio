const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "glauberads21@gmail.com";
  const password = "cf39dce0-e7cf-4dc5-89d7-74024a1f13fc";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "super admin"
    },
    create: {
      email,
      passwordHash,
      role: "super admin"
    }
  });

  console.log("Admin user created/updated successfully:", user.email, "with role:", user.role);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
