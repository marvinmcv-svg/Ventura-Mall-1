import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/prisma-errors";
import { logActivity } from "@/lib/activity";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const ALLOWED_STATUSES = ["new", "read", "replied", "archived", "spam"];
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const data: any = {};
    if (typeof body.status === "string" && ALLOWED_STATUSES.includes(body.status)) data.status = body.status.slice(0, 20);
    const item = await db.contactMessage.update({ where: { id }, data });
    await logActivity({ action: "update", entity: "message", entityId: id, entityName: item.email, username: auth.username });
    return NextResponse.json({ ok: true, item });
  } catch (error) { console.error("[messages PUT]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try { const { id } = await params; const msg = await db.contactMessage.findUnique({ where: { id }, select: { email: true, subject: true } }); await db.contactMessage.delete({ where: { id } }); await logActivity({ action: "delete", entity: "message", entityId: id, entityName: msg?.email || msg?.subject || undefined, username: auth.username }); return NextResponse.json({ ok: true }); }
  catch (error) { console.error("[messages DELETE]", error); const pr = prismaErrorResponse(error); if (pr) return pr; return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
