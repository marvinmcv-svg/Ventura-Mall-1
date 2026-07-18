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
    const format = url.searchParams.get("format");
    const items = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    if (format === "csv") {
      const header = "email,name,source,active,createdAt\n";
      const rows = items.map((s) => [s.email, s.name || "", s.source, s.active ? "true" : "false", s.createdAt.toISOString()].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      return new NextResponse(header + rows, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="suscriptores-ventura-${new Date().toISOString().slice(0,10)}.csv"` } });
    }
    return NextResponse.json({ ok: true, items });
  } catch (error) { console.error("[subscribers GET]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
