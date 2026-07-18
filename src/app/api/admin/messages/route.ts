import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try { const items = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } }); return NextResponse.json({ ok: true, items }); }
  catch (error) { console.error("[messages GET]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
