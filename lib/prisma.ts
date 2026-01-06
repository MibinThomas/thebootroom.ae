import { PrismaClient } from '@prisma/client';

/**
 * Create a singleton Prisma client. In development, we attach the instance to the
 * `globalThis` object to avoid exhausting database connections when hot reloading.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;