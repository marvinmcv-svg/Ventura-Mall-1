import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyPassword, generateToken, SESSION_COOKIE, SESSION_TTL_MS, verifySession } from "@/lib/auth";

export async function requireAdmin(): Promise<{ ok: true; username: string } | { ok: false }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return { ok: false };
  return { ok: true, username: session.username };
}

export async function adminLogin(username: string, password: string): Promise<{ ok: boolean; error?: string; token?: string }> {
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user) return { ok: false, error: "Usuario o contraseña incorrectos." };
  const valid = verifyPassword(password, user.password);
  if (!valid) return { ok: false, error: "Usuario o contraseña incorrectos." };
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.adminSession.create({ data: { token, username: user.username, expiresAt } });
  return { ok: true, token };
}

export async function adminLogout(token?: string): Promise<void> {
  if (!token) return;
  await db.adminSession.deleteMany({ where: { token } }).catch(() => {});
}

export { SESSION_COOKIE, SESSION_TTL_MS };
