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
    if (typeof body.status === "string") data.status = body.status;
    const item = await db.contactMessage.update({ where: { id }, data });
    await logActivity({ action: "update", entity: "message", entityId: id, entityName: item.email, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[messages PUT]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try { const { id } = await params; await db.contactMessage.delete({ where: { id } }); await logActivity({ action: "delete", entity: "message", entityId: id, username: auth.username }); return NextResponse.json({ ok: true }); }
  catch (error) { console.error("[messages DELETE]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
