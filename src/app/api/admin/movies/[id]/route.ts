import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/prisma-errors";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FIELDS = ["title","format","genre","rating","poster","synopsis","ticketUrl","order","active","featured"] as const;
function pick(body: any) {
  const out: any = {};
  for (const f of FIELDS) {
    if (f in body) {
      if (f === "active" || f === "featured") out[f] = Boolean(body[f]);
      else if (f === "order") out[f] = Number(body[f]) || 0;
      else out[f] = String(body[f] ?? "");
    }
  }
  if (body.duration !== undefined) { const n = Number(body.duration); out.duration = isNaN(n) ? null : n; }
  if (Array.isArray(body.showtimes)) out.showtimes = JSON.stringify(body.showtimes.map(String));
  return out;
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.movie.update({ where: { id }, data: pick(await req.json().catch(() => ({}))) });
    await logActivity({ action: "update", entity: "movie", entityId: id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[movies PUT]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const item = await db.movie.findUnique({ where: { id } });
    await db.movie.delete({ where: { id } });
    await logActivity({ action: "delete", entity: "movie", entityId: id, entityName: item?.title, username: auth.username });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[movies DELETE]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
