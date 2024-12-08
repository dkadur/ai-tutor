import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
  // Declare a global flag to check if middleware has been added
  var isPrismaMiddlewareAdded: boolean | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (!global.isPrismaMiddlewareAdded) {
  // Add middleware to log queries
  // prisma.$use(async (params, next) => {
  //   const stack = __dirname; // Capture the stack trace for more detailed logging

  //   const start = Date.now();
  //   const result = await next(params);
  //   const duration = Date.now() - start;

  //   return result;
  // });

  // Set the flag to prevent adding the middleware again
  global.isPrismaMiddlewareAdded = true;
}

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;