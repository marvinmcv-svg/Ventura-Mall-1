import { PrismaClient } from '@prisma/client'
import { mkdirSync, existsSync } from 'fs'
import path from 'path'

// Always use an absolute path for the SQLite database so build-time and
// runtime resolve to the same file. Without this, `file:./db/custom.db`
// can resolve relative to different working directories between `next build`
// and `next start`, causing the production server to find an empty DB.
const DB_DIR = path.join(process.cwd(), 'db')
const DB_FILE = path.join(DB_DIR, 'custom.db')

// Ensure the db directory exists (for fresh deployments)
if (!existsSync(DB_DIR)) {
  try { mkdirSync(DB_DIR, { recursive: true }) } catch {}
}

// Always set DATABASE_URL to the absolute path (overrides any relative path in .env)
process.env.DATABASE_URL = `file:${DB_FILE}`

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
