import { db } from "./db";

export interface SiteContent {
  settings: Record<string, string>;
  stores: StoreItem[];
  experiences: ExperienceItem[];
  promos: PromoItem[];
  events: EventItem[];
  gallery: GalleryItemRow[];
  movies: MovieItem[];
  faqs: FaqItemRow[];
  subscriberCount: number;
}

export interface StoreItem {
  id: string; name: string; category: string; level: string; description: string;
  color: string; textOn: "light" | "dark"; featured: boolean; logoUrl: string | null;
  phone: string | null; website: string | null;
}
export interface ExperienceItem {
  id: string; title: string; subtitle: string; description: string; image: string;
  badge: string; accent: string; highlights: string[];
}
export interface PromoItem {
  id: string; title: string; description: string; category: string; date: string;
  accent: string; emoji: string; image: string | null;
}
export interface EventItem {
  id: string; title: string; description: string; category: string; date: string;
  endDate: string | null; location: string | null; image: string | null; accent: string; featured: boolean;
}
export interface GalleryItemRow {
  id: string; title: string; image: string; caption: string | null; category: string;
}
export interface MovieItem {
  id: string; title: string; format: string; genre: string | null; duration: number | null;
  rating: string | null; poster: string | null; synopsis: string | null; showtimes: string[];
  ticketUrl: string | null; featured: boolean;
}
export interface FaqItemRow {
  id: string; question: string; answer: string; category: string;
}

function safeParseArray(s: string | null): string[] {
  if (!s) return [];
  try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
}

export async function getSiteContent(): Promise<SiteContent> {
  const [settingsRows, stores, experiences, promos, events, gallery, movies, faqs, subscriberCount] =
    await Promise.all([
      db.siteSetting.findMany(),
      db.store.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { name: "asc" }] }),
      db.experience.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.promo.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.event.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { date: "asc" }] }),
      db.galleryItem.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.movie.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.faqItem.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
      db.subscriber.count({ where: { active: true } }),
    ]);

  const settings: Record<string, string> = {};
  for (const r of settingsRows) settings[r.id] = r.value;

  return {
    settings,
    stores: stores.map((s) => ({
      id: s.id, name: s.name, category: s.category, level: s.level, description: s.description,
      color: s.color, textOn: (s.textOn as "light" | "dark") || "light", featured: s.featured,
      logoUrl: s.logoUrl, phone: s.phone, website: s.website,
    })),
    experiences: experiences.map((e) => ({
      id: e.id, title: e.title, subtitle: e.subtitle, description: e.description, image: e.image,
      badge: e.badge, accent: e.accent, highlights: safeParseArray(e.highlights),
    })),
    promos: promos.map((p) => ({
      id: p.id, title: p.title, description: p.description, category: p.category, date: p.date,
      accent: p.accent, emoji: p.emoji, image: p.image,
    })),
    events: events.map((e) => ({
      id: e.id, title: e.title, description: e.description, category: e.category,
      date: e.date.toISOString(), endDate: e.endDate ? e.endDate.toISOString() : null,
      location: e.location, image: e.image, accent: e.accent, featured: e.featured,
    })),
    gallery: gallery.map((g) => ({
      id: g.id, title: g.title, image: g.image, caption: g.caption, category: g.category,
    })),
    movies: movies.map((m) => ({
      id: m.id, title: m.title, format: m.format, genre: m.genre, duration: m.duration,
      rating: m.rating, poster: m.poster, synopsis: m.synopsis, showtimes: safeParseArray(m.showtimes),
      ticketUrl: m.ticketUrl, featured: m.featured,
    })),
    faqs: faqs.map((f) => ({
      id: f.id, question: f.question, answer: f.answer, category: f.category,
    })),
    subscriberCount,
  };
}
