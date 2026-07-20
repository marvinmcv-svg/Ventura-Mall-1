import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["title","description","category","date","accent","emoji","image","media","order","active"] as const;
function pick(body: any) {
  const out: any = {};
  for (const f of FIELDS) {
    if (f in body) {
      if (f === "active") out[f] = Boolean(body[f]);
      else if (f === "order") out[f] = Number(body[f]) || 0;
      else out[f] = String(body[f] ?? "");
    }
  }
  return out;
}
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const items = await db.promo.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const data = pick(body);
    if (!data.title) return NextResponse.json({ ok: false, error: "Título requerido" }, { status: 400 });
    if (!data.emoji) data.emoji = "✨";
    if (!data.accent) data.accent = "coral";
    const item = await db.promo.create({ data });
    await logActivity({ action: "create", entity: "promo", entityId: item.id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[promos POST]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
