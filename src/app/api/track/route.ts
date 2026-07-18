import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 500) : null;
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 100) : null;
    const ua = req.headers.get("user-agent") || "";
    await db.pageView.create({ data: { path, referrer, device: detectDevice(ua), sessionId } });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("[track POST]", error); return NextResponse.json({ ok: false }, { status: 500 }); }
}
