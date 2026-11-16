import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Vercel serverless functions have a read-only filesystem, so the SQLite
 * database bundled with the deployment is copied to /tmp once per server
 * instance before Prisma opens it. Locally (no VERCEL env) nothing changes.
 */
function ensureWritableDatabase() {
  if (!process.env.VERCEL) return
  try {
    const target = '/tmp/randap.db'
    if (fs.existsSync(target)) return
    const candidates = [
      path.join(process.cwd(), 'db', 'custom.db'),
      path.join(process.cwd(), '.next', 'standalone', 'db', 'custom.db'),
      path.join(process.cwd(), '..', 'db', 'custom.db'),
    ]
    const source = candidates.find((p) => fs.existsSync(p))
    if (source) fs.copyFileSync(source, target)
  } catch {
    // ignore — DATABASE_URL may already point to a writable database
  }
}

ensureWritableDatabase()

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
