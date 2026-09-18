// server/db/prisma.js
// Safe server-side Prisma Client singleton instance.
// IMPORTANT: This file must ONLY be imported by Node.js server scripts / API handlers.
// Never import this file into client-side React components.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
