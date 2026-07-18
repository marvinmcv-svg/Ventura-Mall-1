import { createHash, randomBytes, timingSafeEqual, scryptSync } from "crypto";

const ITERATIONS = 100000;

function derive(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = derive(password, salt);
  return `scrypt$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "scrypt") return false;
    const salt = parts[2];
    const hash = parts[3];
    const test = derive(password, salt);
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(test, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export const SESSION_COOKIE = "ventura_admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function verifySession(token: string | undefined): Promise<{ username: string } | null> {
  if (!token) return null;
  const { db } = await import("./db");
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return { username: session.username };
}
