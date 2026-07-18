import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLogout, SESSION_COOKIE } from "@/lib/admin-auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  await adminLogout(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
