import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  const rows = await db.siteSetting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.id] = r.value;
  return NextResponse.json({ ok: true, settings });
}
// Whitelist of allowed setting keys — prevents arbitrary key injection / namespace collisions.
const ALLOWED_SETTING_KEYS = new Set([
  "siteName", "tagline", "heroEyebrow", "heroTitle", "heroSubtitle", "heroImage",
  "aboutText", "address", "city", "phone", "email", "instagram", "facebook", "twitter", "foursquare",
  "lat", "lng", "inaugurated", "investment", "area", "architect", "floors", "marqueeItems",
]);
const MAX_VALUE_LEN = 5000;

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const incoming = body?.settings;
    if (!incoming || typeof incoming !== "object") return NextResponse.json({ ok: false, error: "Se requiere { settings: {...} }" }, { status: 400 });
    const keys = Object.keys(incoming).filter((k) => ALLOWED_SETTING_KEYS.has(k));
    if (keys.length === 0) return NextResponse.json({ ok: false, error: "Ninguna clave permitida" }, { status: 400 });
    for (const k of keys) { const v = String(incoming[k] ?? "").slice(0, MAX_VALUE_LEN); await db.siteSetting.upsert({ where: { id: k }, update: { value: v }, create: { id: k, value: v } }); }
    await logActivity({ action: "update", entity: "settings", username: auth.username, details: `${keys.length} campos` });
    return NextResponse.json({ ok: true, updated: keys.length });
  } catch (error) { console.error("[settings PUT]", error); return NextResponse.json({ ok: false, error: "Error al guardar" }, { status: 500 }); }
}
