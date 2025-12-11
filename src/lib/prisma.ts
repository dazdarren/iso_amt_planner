import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if using Prisma Accelerate
const isAccelerate = process.env.DATABASE_URL?.includes('prisma+postgres://');

export const prisma =
  globalForPrisma.prisma ??
  (isAccelerate
    ? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }).$extends(withAccelerate())
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
