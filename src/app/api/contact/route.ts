import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim().slice(0, 120) : "General";
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 5000) : "";
    if (!name || !email || !message) return NextResponse.json({ ok: false, error: "Nombre, email y mensaje son requeridos." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "Email inválido." }, { status: 400 });
    await db.contactMessage.create({ data: { name, email, subject, message } });
    return NextResponse.json({ ok: true, message: "¡Mensaje enviado! Te contactaremos pronto." }, { status: 201 });
  } catch (error) { console.error("[contact POST]", error); return NextResponse.json({ ok: false, error: "Error al enviar el mensaje." }, { status: 500 }); }
}
