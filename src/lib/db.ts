import { PrismaClient } from '@prisma/client'
import { mkdirSync, existsSync } from 'fs'
import path from 'path'

// Ensure the db directory exists (for fresh deployments where it hasn't been created yet)
const dbDir = path.join(process.cwd(), 'db')
if (!existsSync(dbDir)) {
  try { mkdirSync(dbDir, { recursive: true }) } catch {}
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
