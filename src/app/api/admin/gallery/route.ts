import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["title","image","caption","category","order","active"] as const;
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
  const items = await db.galleryItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const data = pick(body);
    if (!data.title || !data.image) return NextResponse.json({ ok: false, error: "Título e imagen requeridos" }, { status: 400 });
    const item = await db.galleryItem.create({ data });
    await logActivity({ action: "create", entity: "gallery", entityId: item.id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[gallery POST]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
