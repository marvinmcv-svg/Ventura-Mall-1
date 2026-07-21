import { db } from "./db";
import { hashPassword } from "./auth";

/**
 * Auto-seed: ensures the database has at least an admin user and basic content.
 * Runs on first API hit if the DB is empty (e.g. after a schema push wipes data).
 * Idempotent — only seeds what's missing, never overwrites existing data.
 * This guards against the recurring "DB wiped by prisma db:push" problem.
 */

const ADMIN_USERNAME = "MarvinC";
const ADMIN_PASSWORD = "VenturaMall123!";

let seeded = false;

export async function ensureSeed(): Promise<void> {
  if (seeded) return;

  try {
    const adminCount = await db.adminUser.count();
    if (adminCount === 0) {
      // DB is empty — create the admin user.
      await db.adminUser.create({
        data: {
          username: ADMIN_USERNAME,
          password: await hashPassword(ADMIN_PASSWORD),
          role: "admin",
        },
      });
      console.log("[auto-seed] Admin user created:", ADMIN_USERNAME);
    }

    const storeCount = await db.store.count();
    if (storeCount === 0) {
      // DB has no content — seed minimal settings + a few stores so the site isn't blank.
      await seedSettings();
      await seedStores();
      console.log("[auto-seed] Basic content seeded");
    }

    seeded = true;
  } catch (error) {
    console.error("[auto-seed] error:", error);
    // Don't throw — let the request continue with whatever state the DB is in.
  }
}

async function seedSettings(): Promise<void> {
  const settings: Record<string, string> = {
    siteName: "Ventura Mall",
    tagline: "Vive la experiencia",
    heroTitle: "Donde Santa Cruz\nse encuentra",
    heroSubtitle:
      "No es un mall. Es 110,000 m² de momentos: la copa que brindas con amigos, el estreno que te eriza la piel, esa tienda que llevas tiempo queriendo visitar. Bienvenido al lugar más vivo de Bolivia.",
    heroImage: "/images/ventura/real/exterior.jpg",
    heroEyebrow: "El mall más grande de Bolivia",
    city: "Santa Cruz de la Sierra, Bolivia",
    address: "Av. San Martín esq. 4to Anillo, Equipetrol Norte",
    phone: "+591 3 3432121",
    email: "info@venturamall.bo",
    instagram: "https://www.instagram.com/venturamalloficial/",
    facebook: "https://www.facebook.com/VenturaMallBolivia",
    twitter: "https://twitter.com/Venturamallbo",
    foursquare: "https://es.foursquare.com/v/ventura-mall/50b2352ce889d4301ce3579d",
    lat: "-17.75465396550155",
    lng: "-63.19979667663574",
    inaugurated: "30 de enero de 2014",
    investment: "50 millones USD",
    area: "110,000 m²",
    architect: "Waldo Alborta",
    floors: "4 plantas + 1 subsuelo",
    aboutText:
      "Ventura Mall no nació de la nada. Nació de un sueño cruceño: crear un espacio donde el mundo se encontrara con Santa Cruz. El arquitecto Waldo Alborta lo diseñó rindiendo homenaje a la ciudad — sus barrios, las misiones jesuíticas, los textiles, la Amazonía. Cada esquina cuenta una historia. Cada visita crea una nueva.",
    marqueeItems:
      '["🎬 Martes 2x1 en Cinemark — trae a quien más quieres","🍹 Happy Hour toda la semana en el Boulevard","🛍️ Venta privada VIP este viernes — hasta 70% off","🎉 Festejá tu cumple con nosotros","⚡ Cargá tu eléctrico gratis en el subsuelo","🎵 Música en vivo cada jueves en Hard Rock"]',
  };
  for (const [k, v] of Object.entries(settings)) {
    await db.siteSetting.upsert({ where: { id: k }, update: { value: v }, create: { id: k, value: v } });
  }
}

async function seedStores(): Promise<void> {
  const stores = [
    { name: "Zara", category: "Moda", level: "Nivel 1", description: "La moda que ves en las revistas, a pasos de tu casa. Tendencias que llegan primero aquí.", color: "bg-ink", textOn: "light", featured: true, order: 1, images: '["/images/ventura/real/adidas-store.jpg","/images/ventura/real/huawei-corridor.jpg","/images/ventura/real/interior-escalators.jpg"]' },
    { name: "Nike", category: "Moda", level: "Nivel 2", description: "Just do it — en serio. El planeta deporte bajo un mismo techo, con las siluetas que todos quieren.", color: "bg-ink", textOn: "light", featured: true, order: 2 },
    { name: "Adidas", category: "Moda", level: "Nivel 2", description: "Impossible is nothing. Desde las UltraBoost hasta elOriginals que marca tendencia en la calle.", color: "bg-zinc-800", textOn: "light", order: 3 },
    { name: "Levi's", category: "Moda", level: "Nivel 1", description: "El jean que vistió al mundo. Cortes clásicos y ediciones limitadas que no encuentran en otro lado.", color: "bg-red-700", textOn: "light", order: 4 },
    { name: "Puma", category: "Moda", level: "Nivel 2", description: "Forever Faster. Performance y streetwear en equilibrio perfecto.", color: "bg-zinc-900", textOn: "light", order: 5 },
    { name: "Cinemark", category: "Entretenimiento", level: "Nivel 3", description: "13 salas, 4 VIP y la pantalla IMAX de 16m x 21m. El estreno que esperás, como debe verse.", color: "bg-ink", textOn: "light", featured: true, order: 10 },
    { name: "Hard Rock Café", category: "Gastronomía", level: "Nivel 3", description: "Una hamburguesa legendaria con banda sonora en vivo. El plan que nunca falla.", color: "bg-red-700", textOn: "light", featured: true, order: 20 },
    { name: "Patio de Comidas", category: "Gastronomía", level: "Nivel 2", description: "Más de 15 propuestas para cada antojo. Desde un café rápido hasta una comida completa.", color: "bg-orange-600", textOn: "light", featured: true, order: 21 },
    { name: "Telepizza", category: "Gastronomía", level: "Nivel 2", description: "Pizza al horno, masa artesanal. Pedí tu favorita y compartí.", color: "bg-red-600", textOn: "light", order: 22 },
    { name: "Coffee Shop", category: "Gastronomía", level: "Nivel 1", description: "El mejor café de especialidad de Santa Cruz. Para arrancar el día o la pausa perfecta.", color: "bg-amber-700", textOn: "light", order: 23 },
    { name: "ENDE Carga", category: "Servicios", level: "Subsuelo", description: "Cargá tu eléctrico gratis mientras comprás. Energía limpia para una ciudad que avanza.", color: "bg-emerald-800", textOn: "light", order: 30 },
    { name: "Banco", category: "Servicios", level: "Nivel 1", description: "Cajeros 24/7 y atención bancaria completa. Todo lo que necesitás, en un solo lugar.", color: "bg-blue-900", textOn: "light", order: 31 },
  ];
  for (const s of stores) {
    await db.store.create({ data: s });
  }
}
