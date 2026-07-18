import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
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
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const items = await db.movie.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ ok: true, items });
}
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const data = pick(body);
    if (!data.title) return NextResponse.json({ ok: false, error: "Título requerido" }, { status: 400 });
    if (!data.showtimes) data.showtimes = JSON.stringify([]);
    const item = await db.movie.create({ data });
    await logActivity({ action: "create", entity: "movie", entityId: item.id, entityName: item.title, username: auth.username });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) { console.error("[movies POST]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
