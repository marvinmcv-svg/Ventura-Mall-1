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
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.event.update({ where: { id }, data: pick(await req.json().catch(() => ({}))) });
    await logActivity({ action: "update", entity: "event", entityId: id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[events PUT]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.event.findUnique({ where: { id } });
    await db.event.delete({ where: { id } });
    await logActivity({ action: "delete", entity: "event", entityId: id, entityName: item?.title, username: auth.username });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[events DELETE]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
