import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const data: any = {};
    if (typeof body.active === "boolean") data.active = body.active;
    if (typeof body.name === "string") data.name = body.name;
    const item = await db.subscriber.update({ where: { id }, data });
    await logActivity({ action: "update", entity: "subscriber", entityId: id, entityName: item.email, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[subscribers PUT]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const sub = await db.subscriber.findUnique({ where: { id } });
    await db.subscriber.delete({ where: { id } });
    if (sub) await logActivity({ action: "delete", entity: "subscriber", entityId: id, entityName: sub.email, username: auth.username });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[subscribers DELETE]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
