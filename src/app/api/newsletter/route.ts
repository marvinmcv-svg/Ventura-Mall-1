import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// RFC 5321 caps an email at 254 chars. The local-part at 64 and domain at 253 are also RFC limits.
const MAX_EMAIL_LEN = 254;
// Strict email regex: rejects angle brackets, quotes, and other shell/HTML metacharacters
// that have no place in a real address. Allows the standard printable ASCII email charset.
function isValidEmail(email: string): boolean {
  if (email.length > MAX_EMAIL_LEN) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(email);
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, MAX_EMAIL_LEN) : "";
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : null;
    if (!email || !isValidEmail(email)) return NextResponse.json({ ok: false, error: "Por favor ingresa un correo electrónico válido." }, { status: 400 });
    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing) {
      const updated = await db.subscriber.update({ where: { email }, data: { active: true, name: name ?? existing.name } });
      return NextResponse.json({ ok: true, message: "¡Ya estabas suscrito! Hemos reactivado tu suscripción.", subscriber: { email: updated.email } });
    }
    const created = await db.subscriber.create({ data: { email, name, source: "landing", active: true } });
    return NextResponse.json({ ok: true, message: "¡Gracias por suscribirte a Ventura Mall! Pronto recibirás promociones exclusivas.", subscriber: { email: created.email } }, { status: 201 });
  } catch (error) {
    console.error("[newsletter] error:", error);
    return NextResponse.json({ ok: false, error: "Ocurrió un error al procesar tu suscripción." }, { status: 500 });
  }
}
export async function GET() {
  try { const count = await db.subscriber.count({ where: { active: true } }); return NextResponse.json({ ok: true, activeSubscribers: count }); }
  catch { return NextResponse.json({ ok: true, activeSubscribers: 0 }); }
}
