import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const entity = url.searchParams.get("entity");
    const items = await db.activityLog.findMany({ where: entity ? { entity } : {}, orderBy: { createdAt: "desc" }, take: limit });
    return NextResponse.json({ ok: true, items });
  } catch (error) { console.error("[activity GET]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
