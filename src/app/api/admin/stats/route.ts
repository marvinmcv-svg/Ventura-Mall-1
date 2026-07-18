import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const [stores, experiences, promos, events, gallery, movies, faqs, subscribers] = await Promise.all([
      db.store.count(), db.experience.count(), db.promo.count(), db.event.count(),
      db.galleryItem.count(), db.movie.count(), db.faqItem.count(),
      db.subscriber.count({ where: { active: true } }),
    ]);
    return NextResponse.json({ ok: true, stats: { stores, experiences, promos, events, gallery, movies, faqs, subscribers } });
  } catch (error) { console.error("[admin stats] error:", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
