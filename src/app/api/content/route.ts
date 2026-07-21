import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content";
import { ensureSeed } from "@/lib/auto-seed";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Auto-seed the DB if it's empty (guards against prisma db:push wiping data).
    await ensureSeed();
    const content = await getSiteContent();
    return NextResponse.json({ ok: true, content }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("[content GET] error:", error);
    return NextResponse.json({ ok: false, error: "No se pudo cargar el contenido." }, { status: 500 });
  }
}
