import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/prisma-errors";
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
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.experience.update({ where: { id }, data: pick(await req.json().catch(() => ({}))) });
    await logActivity({ action: "update", entity: "experience", entityId: id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[experiences PUT]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.experience.findUnique({ where: { id } });
    await db.experience.delete({ where: { id } });
    await logActivity({ action: "delete", entity: "experience", entityId: id, entityName: item?.title, username: auth.username });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[experiences DELETE]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
