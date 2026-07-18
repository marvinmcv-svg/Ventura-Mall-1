import { NextRequest, NextResponse } from "next/server";
import { adminLogin, SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) return NextResponse.json({ ok: false, error: "Usuario y contraseña son requeridos." }, { status: 400 });
    const result = await adminLogin(username, password);
    if (!result.ok || !result.token) return NextResponse.json({ ok: false, error: result.error }, { status: 401 });
    const res = NextResponse.json({ ok: true, username });
    await logActivity({ action: "login", entity: "auth", entityName: username, username });
    res.cookies.set(SESSION_COOKIE, result.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: Math.floor(SESSION_TTL_MS / 1000) });
    return res;
  } catch (error) { console.error("[admin login] error:", error); return NextResponse.json({ ok: false, error: "Error al iniciar sesión." }, { status: 500 }); }
}
