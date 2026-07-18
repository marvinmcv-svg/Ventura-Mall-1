import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["title","subtitle","description","image","badge","accent","order","active"] as const;
function pick(body: any) {
  const out: any = {};
  for (const f of FIELDS) {
    if (f in body) {
      if (f === "active") out[f] = Boolean(body[f]);
      else if (f === "order") out[f] = Number(body[f]) || 0;
      else out[f] = String(body[f] ?? "");
    }
  }
  if (Array.isArray(body.highlights)) out.highlights = JSON.stringify(body.highlights.map(String));
  return out;
}
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const items = await db.experience.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const data = pick(body);
    if (!data.title) return NextResponse.json({ ok: false, error: "Título requerido" }, { status: 400 });
    if (!data.highlights) data.highlights = JSON.stringify([]);
    const item = await db.experience.create({ data });
    await logActivity({ action: "create", entity: "experience", entityId: item.id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[experiences POST]", error); return NextResponse.json({ ok: false, error: "Error al crear" }, { status: 500 }); }
}
