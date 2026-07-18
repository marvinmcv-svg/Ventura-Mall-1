import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["name","category","level","description","color","textOn","featured","logoUrl","phone","website","order","active"] as const;
function pick(body: any) {
  const out: any = {};
  for (const f of FIELDS) {
    if (f in body) {
      if (f === "featured" || f === "active") out[f] = Boolean(body[f]);
      else if (f === "order") out[f] = Number(body[f]) || 0;
      else out[f] = String(body[f] ?? "");
    }
  }
  return out;
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.store.update({ where: { id }, data: pick(await req.json().catch(() => ({}))) });
    await logActivity({ action: "update", entity: "store", entityId: id, entityName: item.name, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[stores PUT]", error); return NextResponse.json({ ok: false, error: "Error al actualizar" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const store = await db.store.findUnique({ where: { id } });
    await db.store.delete({ where: { id } });
    await logActivity({ action: "delete", entity: "store", entityId: id, entityName: store?.name, username: auth.username });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[stores DELETE]", error); return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 }); }
}
