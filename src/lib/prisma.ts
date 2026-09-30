import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance
} catch (e) {
  console.warn("Prisma client initialization failed (expected during build):", e)
  prismaInstance = {} as PrismaClient
}

export const prisma = prismaInstance
