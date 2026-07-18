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
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const items = await db.store.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.bulk && Array.isArray(body.ids)) {
      const action = body.bulk;
      for (const id of body.ids) {
        if (action === "delete") await db.store.delete({ where: { id } });
        else if (action === "activate") await db.store.update({ where: { id }, data: { active: true } });
        else if (action === "deactivate") await db.store.update({ where: { id }, data: { active: false } });
      }
      await logActivity({ action: "bulk", entity: "store", username: auth.username, details: JSON.stringify({ action, count: body.ids.length }) });
      return NextResponse.json({ ok: true, affected: body.ids.length });
    }
    const data = pick(body);
    if (!data.name) return NextResponse.json({ ok: false, error: "Nombre requerido" }, { status: 400 });
    const item = await db.store.create({ data });
    await logActivity({ action: "create", entity: "store", entityId: item.id, entityName: item.name, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[stores POST]", error); return NextResponse.json({ ok: false, error: "Error al crear" }, { status: 500 }); }
}
