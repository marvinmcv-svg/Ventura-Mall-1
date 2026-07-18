import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["title","description","category","location","image","accent","order","active","featured"] as const;
function pick(body: any) {
  const out: any = {};
  for (const f of FIELDS) {
    if (f in body) {
      if (f === "active" || f === "featured") out[f] = Boolean(body[f]);
      else if (f === "order") out[f] = Number(body[f]) || 0;
      else out[f] = String(body[f] ?? "");
    }
  }
  if (body.date) { const d = new Date(body.date); if (!isNaN(d.getTime())) out.date = d; }
  if (body.endDate !== undefined) {
    if (body.endDate === null || body.endDate === "") out.endDate = null;
    else { const d = new Date(body.endDate); if (!isNaN(d.getTime())) out.endDate = d; }
  }
  return out;
}
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const items = await db.event.findMany({ orderBy: [{ order: "asc" }, { date: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const data = pick(body);
    if (!data.title) return NextResponse.json({ ok: false, error: "Título requerido" }, { status: 400 });
    if (!data.date) data.date = new Date();
    const item = await db.event.create({ data });
    await logActivity({ action: "create", entity: "event", entityId: item.id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[events POST]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
