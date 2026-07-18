import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  return NextResponse.json({ ok: true, authenticated: true, username: auth.username });
}
