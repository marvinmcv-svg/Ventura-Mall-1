import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [totalViews, viewsLast7d, viewsLast30d, viewsByDayRaw, topPagesRaw, subscribersTotal, subscribersLast7d, subscribersByDayRaw, storesCount, eventsCount, promosCount, upcomingEvents, messagesNew] = await Promise.all([
      db.pageView.count(), db.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }), db.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      db.pageView.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, device: true, path: true } }),
      db.pageView.groupBy({ by: ["path"], _count: true, orderBy: { _count: { path: "desc" } }, take: 10 }),
      db.subscriber.count({ where: { active: true } }), db.subscriber.count({ where: { active: true, createdAt: { gte: sevenDaysAgo } } }),
      db.subscriber.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true } }),
      db.store.count({ where: { active: true } }), db.event.count({ where: { active: true } }), db.promo.count({ where: { active: true } }),
      db.event.count({ where: { active: true, date: { gte: now } } }), db.contactMessage.count({ where: { status: "new" } }),
    ]);
    const viewsByDay: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0); dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
      viewsByDay.push({ date: dayStart.toISOString().slice(0, 10), views: viewsByDayRaw.filter((v) => v.createdAt >= dayStart && v.createdAt < dayEnd).length });
    }
    const subscriberGrowth: { date: string; total: number }[] = [];
    let cumulative = subscribersTotal - subscribersByDayRaw.length;
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0); dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
      cumulative += subscribersByDayRaw.filter((s) => s.createdAt >= dayStart && s.createdAt < dayEnd).length;
      subscriberGrowth.push({ date: dayStart.toISOString().slice(0, 10), total: Math.max(0, cumulative) });
    }
    return NextResponse.json({ ok: true, analytics: { totalViews, viewsLast7d, viewsLast30d, viewsByDay, topPages: topPagesRaw.map((p) => ({ path: p.path, views: p._count })), subscribersTotal, subscribersLast7d, subscriberGrowth, deviceBreakdown: { mobile: viewsByDayRaw.filter((v) => v.device === "mobile").length, desktop: viewsByDayRaw.filter((v) => v.device === "desktop").length, tablet: viewsByDayRaw.filter((v) => v.device === "tablet").length }, contentStats: { stores: storesCount, events: eventsCount, promos: promosCount, upcomingEvents, messagesNew } } });
  } catch (error) { console.error("[analytics GET]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
