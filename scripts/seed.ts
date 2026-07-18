import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ventura2024";

async function main() {
  console.log("🌱 Seeding Ventura Mall database...");
  const existingAdmin = await db.adminUser.findUnique({ where: { username: ADMIN_USERNAME } });
  if (!existingAdmin) {
    await db.adminUser.create({ data: { username: ADMIN_USERNAME, password: await hashPassword(ADMIN_PASSWORD), role: "admin" } });
    console.log(`  ✓ Admin: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
  }

  const settings: Record<string, string> = {
    siteName: "Ventura Mall",
    tagline: "Vive la experiencia",
    heroTitle: "Donde Santa Cruz\nse encuentra",
    heroSubtitle: "No es un mall. Es 110,000 m² de momentos: la copa que brindas con amigos, el estreno que te eriza la piel, esa tienda que llevas tiempo queriendo visitar. Bienvenido al lugar más vivo de Bolivia.",
    heroImage: "/images/ventura/real/exterior.jpg",
    heroEyebrow: "El mall más grande de Bolivia",
    city: "Santa Cruz de la Sierra, Bolivia",
    address: "Av. San Martín esq. 4to Anillo, Equipetrol Norte",
    phone: "+591 3 3432121", email: "info@venturamall.bo",
    instagram: "https://www.instagram.com/venturamalloficial/",
    facebook: "https://www.facebook.com/VenturaMallBolivia",
    twitter: "https://twitter.com/Venturamallbo",
    foursquare: "https://es.foursquare.com/v/ventura-mall/50b2352ce889d4301ce3579d",
    lat: "-17.75465396550155", lng: "-63.19979667663574",
    inaugurated: "30 de enero de 2014", investment: "50 millones USD",
    area: "110,000 m²", architect: "Waldo Alborta", floors: "4 plantas + 1 subsuelo",
    aboutText: "Ventura Mall no nació de la nada. Nació de un sueño cruceño: crear un espacio donde el mundo se encontrara con Santa Cruz. El arquitecto Waldo Alborta lo diseñó rindiendo homenaje a la ciudad — sus barrios, las misiones jesuíticas, los textiles, la Amazonía. Cada esquina cuenta una historia. Cada visita crea una nueva.",
    marqueeItems: '["🎬 Martes 2x1 en Cinemark — trae a quien más quieres","🍹 Happy Hour toda la semana en el Boulevard","🛍️ Venta privada VIP este viernes — hasta 70% off","🎉 Festejá tu cumple con nosotros","⚡ Cargá tu eléctrico gratis en el subsuelo","🎵 Música en vivo cada jueves en Hard Rock"]',
  };
  for (const [k, v] of Object.entries(settings)) {
    await db.siteSetting.upsert({ where: { id: k }, update: { value: v }, create: { id: k, value: v } });
  }
  console.log(`  ✓ ${Object.keys(settings).length} settings`);

  if ((await db.store.count()) === 0) {
    await db.store.createMany({ data: [
      { name: "Zara", category: "Moda", level: "Nivel 1", description: "La moda que ves en las revistas, a pasos de tu casa. Tendencias que llegan primero aquí.", color: "bg-ink", textOn: "light", featured: true, order: 1 },
      { name: "Nike", category: "Moda", level: "Nivel 1", description: "Just do it — en serio. El equipamiento que necesitás para superar tu marca personal.", color: "bg-ink", textOn: "light", featured: true, order: 2 },
      { name: "Adidas", category: "Moda", level: "Nivel 1", description: "Estilo urbano que no pasa desapercibido. Ropa y calzado que trabajan tan duro como vos.", color: "bg-zinc-800", textOn: "light", order: 3 },
      { name: "Levi's", category: "Moda", level: "Nivel 1", description: "El jean que vistió generaciones. Desde 1853, el azul que nunca pasa de moda.", color: "bg-red-700", textOn: "light", featured: true, order: 4 },
      { name: "Puma", category: "Moda", level: "Nivel 2", description: "Sportlifestyle con actitud. Calzado que se nota antes de que lo escuchen.", color: "bg-slate-900", textOn: "light", order: 5 },
      { name: "Nautica", category: "Moda", level: "Nivel 1", description: "Espíritu náutico, estilo americano. Prendas que respiran libertad.", color: "bg-blue-900", textOn: "light", order: 6 },
      { name: "Caterpillar", category: "Moda", level: "Nivel 2", description: "Construido para durar. Calzado que sobrevive a todo — igual que vos.", color: "bg-yellow-500", textOn: "dark", order: 7 },
      { name: "Totto", category: "Moda", level: "Nivel 2", description: "Mochilas y accesorios que acompañan cada aventura. Diseño urbano, funcional.", color: "bg-orange-600", textOn: "light", order: 8 },
      { name: "Casa Ideas", category: "Hogar", level: "Nivel 1", description: "Tu casa con personalidad. Decoración que hace que volver a casa sea lo mejor del día.", color: "bg-rose-500", textOn: "light", featured: true, order: 9 },
      { name: "La Riviera", category: "Moda", level: "Nivel 2", description: "Elegancia que se nota sin gritar. Moda femenina para la mujer que sabe lo que quiere.", color: "bg-pink-600", textOn: "light", order: 10 },
      { name: "Toby", category: "Moda", level: "Nivel 2", description: "Moda joven con actitud. Para los que escriben su propio estilo.", color: "bg-neutral-700", textOn: "light", order: 11 },
      { name: "Hard Rock Café", category: "Gastronomía", level: "Boulevard", description: "Una burger, una cerveza, y la historia del rock en las paredes. Capacidad para 400 personas que vibran.", color: "bg-amber-700", textOn: "light", featured: true, order: 12 },
      { name: "Starbucks Coffee", category: "Gastronomía", level: "Nivel 2", description: "Tu momento del día. Café de especialidad que convierte una pausa en un ritual.", color: "bg-emerald-800", textOn: "light", featured: true, order: 13 },
      { name: "KFC", category: "Gastronomía", level: "Patio de Comida", description: "El pollo frito con 11 hierbas y especias que conquista desde 1939. Receta secreta, sabor real.", color: "bg-red-600", textOn: "light", featured: true, order: 14 },
      { name: "Juan Valdez", category: "Gastronomía", level: "Boulevard", description: "Café colombiano de altura. El orgullo de un país en cada taza humeante.", color: "bg-red-900", textOn: "light", order: 15 },
      { name: "Sbarro", category: "Gastronomía", level: "Patio de Comida", description: "Pizza al estilo neoyorquino. El doble de queso, el doble de placer.", color: "bg-green-700", textOn: "light", order: 16 },
      { name: "Green is Better", category: "Gastronomía", level: "Patio de Comida", description: "Ensaladas que no aburren. Frescura francesa que hace del comer sano un placer.", color: "bg-lime-600", textOn: "light", order: 17 },
      { name: "Yogurt & Berries", category: "Gastronomía", level: "Nivel 2", description: "Yogurt helado natural con frutas y toppings. Dulce sin culpa, placer sin límite.", color: "bg-fuchsia-500", textOn: "light", order: 18 },
      { name: "Cinemark Premier", category: "Entretenimiento", level: "Nivel 3", description: "13 salas. 4 VIP. 1 IMAX de 16m × 21m. Más de 1,500 butacas. El cine como experiencia total.", color: "bg-gold", textOn: "dark", featured: true, order: 19 },
      { name: "Bolos & Arcade", category: "Entretenimiento", level: "Nivel 3", description: "Bolos, videojuegos, autos chocadores. Diversión que te devuelve a la infancia.", color: "bg-purple-600", textOn: "light", featured: true, order: 20 },
      { name: "Hipermaxi", category: "Servicios", level: "Nivel 1", description: "Todo lo que necesitás, bajo un mismo techo. El supermercado que nunca cierra temprano.", color: "bg-orange-500", textOn: "light", order: 21 },
      { name: "ENDE Carga", category: "Servicios", level: "Subsuelo", description: "Cargá tu eléctrico mientras comprás. El futuro llegó al estacionamiento.", color: "bg-teal-600", textOn: "light", order: 22 },
    ]});
    console.log("  ✓ 22 stores");
  }

  if ((await db.experience.count()) === 0) {
    await db.experience.createMany({ data: [
      { title: "Cinemark Premier IMAX", subtitle: "13 salas · 4 VIP · 1 IMAX", description: "No es ver una película. Es vivir dentro de ella. La pantalla IMAX más grande de Bolivia — 16 metros de alto por 21 de ancho — te envuelve por completo. Butacas reclinables que te hacen olvidar dónde estás. Salas VIP para los que buscan algo más. Acá el cine no se ve, se siente.", image: "/images/ventura/real/cinemark-xd.jpg", badge: "Cine", accent: "coral", highlights: JSON.stringify(["Pantalla IMAX de 16m × 21m", "4 salas VIP con servicio", "+1,500 butacas reclinables"]), order: 1 },
      { title: "Patio de Comida", subtitle: "Sabores del mundo", description: "Un viaje gastronómico sin salir del mall. Pizza neoyorquina, pollo americano, ensaladas francesas, café colombiano. El patio de comida es el punto de encuentro — donde las familias se reúnen, los amigos ríen, y cada bocado cuenta una historia diferente.", image: "/images/ventura/real/food-court-sbarro.jpg", badge: "Gastronomía", accent: "gold", highlights: JSON.stringify(["Cocina de 5 países", "Ambiente familiar y moderno", "Abierto hasta las 23:00"]), order: 2 },
      { title: "Boulevard Gourmet", subtitle: "Cena & vida nocturna", description: "Cuando el sol se pone, el boulevard despierta. Hard Rock Café con su guitarra gigante iluminada, Juan Valdez con aroma a café colombiano, Starbucks para el último espresso de la noche. Es el lugar donde las cenas se convierten en recuerdos y las noches, en historias.", image: "/images/ventura/real/boulevard-night-guitar.jpg", badge: "Boulevard", accent: "emerald", highlights: JSON.stringify(["Hard Rock Café — capacidad 400", "Restaurantes de autor", "El mejor ambiente nocturno de Santa Cruz"]), order: 3 },
      { title: "Entretenimiento Familiar", subtitle: "Diversión sin límites", description: "Bolos que tiran los pines con fuerza. Videojuegos que te hacen gritar. Autos chocadores que te hacen reír como un niño. Acá la diversión no tiene edad — solo tiene ganas. El plan perfecto para un sábado en familia que nadie va a olvidar.", image: "/images/ventura/real/interior-escalators.jpg", badge: "Diversión", accent: "ink", highlights: JSON.stringify(["Bolos & arcade completo", "Autos chocadores", "Para todas las edades"]), order: 4 },
    ]});
    console.log("  ✓ 4 experiences");
  }

  if ((await db.promo.count()) === 0) {
    await db.promo.createMany({ data: [
      { title: "Martes de Cine 2x1", description: "Cada martes, las entradas van 2x1 en TODAS las salas de Cinemark. Trae a esa persona especial, popcorn incluido. ¿Mejor plan un martes? No existe.", category: "Cine", date: "Todos los martes", accent: "coral", emoji: "🎬", order: 1 },
      { title: "Happy Hour Boulevard", description: "De lunes a jueves, 17:00 a 20:00. Bebidas 2x1 y aperitivos con descuento en todos los restaurantes del boulevard. El after-office te espera.", category: "Gastronomía", date: "Lun — Jue · 17:00 a 20:00", accent: "gold", emoji: "🍹", order: 2 },
      { title: "Venta Privada VIP", description: "Suscribite al newsletter y recibí acceso a ventas privadas con hasta 70% de descuento. Un día al mes, las marcas que amás, a precios que no vas a creer.", category: "Moda", date: "Suscribite para acceder", accent: "emerald", emoji: "🛍️", order: 3 },
      { title: "Cumpleaños en Ventura", description: "Tu cumpleaños merece más que un post. Beneficios especiales en patio de comida, entretenimiento y tiendas. Festejá donde la diversión vive.", category: "Familia", date: "Todo el año", accent: "ink", emoji: "🎉", order: 4 },
    ]});
    console.log("  ✓ 4 promos");
  }

  if ((await db.event.count()) === 0) {
    const now = new Date(); const y = now.getFullYear(); const m = now.getMonth();
    await db.event.createMany({ data: [
      { title: "Noche de Moda: Desfile Otoño", description: "Las nuevas colecciones de Zara, Levi's y Nike desfilan en el atrio central. Cóctel de bienvenida para suscriptores VIP. La moda como nunca la viste en Santa Cruz.", category: "Moda", date: new Date(y, m, 22, 19, 0), endDate: new Date(y, m, 22, 22, 0), location: "Atrio Central — Nivel 1", image: "/images/ventura/real/adidas-store.jpg", accent: "coral", featured: true, order: 1 },
      { title: "Festival de Cine IMAX", description: "Una semana entera de estrenos en la pantalla más grande de Bolivia. Sesiones dobles con descuento para socios. El festival que los cinéfilos esperan todo el año.", category: "Cine", date: new Date(y, m + 1, 5, 18, 0), endDate: new Date(y, m + 1, 12, 23, 0), location: "Cinemark Premier — Nivel 3", image: "/images/ventura/real/cinemark-screen.jpg", accent: "gold", featured: true, order: 2 },
      { title: "Tarde Infantil", description: "Taller de manualidades, face painting y show de magia para los más chicos. Mientras ellos se divierten, vos te relajás con un café. Todos ganan.", category: "Familia", date: new Date(y, m, 15, 15, 0), endDate: new Date(y, m, 15, 19, 0), location: "Patio de Comida — Nivel 2", image: "/images/ventura/real/food-court-1.jpg", accent: "emerald", featured: false, order: 3 },
      { title: "Noche de Boulevard", description: "Música en vivo, cócteles de autor y promociones exclusivas en Hard Rock Café. La noche que redefine qué significa salir en Santa Cruz.", category: "Gastronomía", date: new Date(y, m, 12, 20, 0), endDate: new Date(y, m, 12, 23, 0), location: "Boulevard Gourmet", image: "/images/ventura/real/boulevard-night-guitar.jpg", accent: "ink", featured: false, order: 4 },
    ]});
    console.log("  ✓ 4 events");
  }

  if ((await db.galleryItem.count()) === 0) {
    await db.galleryItem.createMany({ data: [
      { title: "La fachada que recibe", image: "/images/ventura/real/exterior.jpg", caption: "La primera impresión. El sol cruceño sobre la fachada moderna de Ventura Mall.", category: "Arquitectura", order: 1 },
      { title: "El corazón del mall", image: "/images/ventura/real/atrium.jpg", caption: "El atrio central, donde la luz natural y el diseño se encuentran.", category: "Arquitectura", order: 2 },
      { title: "Sabores del mundo", image: "/images/ventura/real/food-court-1.jpg", caption: "El patio de comida siempre tiene una silla para vos.", category: "Gastronomía", order: 3 },
      { title: "Hard Rock de noche", image: "/images/ventura/real/boulevard-night.jpg", caption: "Cuando el boulevard se ilumina, la noche recién empieza.", category: "Gastronomía", order: 4 },
      { title: "Pasillos que respiran", image: "/images/ventura/real/interior-banks.jpg", caption: "Diseño abierto, luz natural y movimiento constante.", category: "Arquitectura", order: 5 },
      { title: "Butacas que envuelven", image: "/images/ventura/real/cinemark-recliners.jpg", caption: "Cinemark Premier — donde el cine se convierte en experiencia.", category: "Cine", order: 6 },
      { title: "El ícono del boulevard", image: "/images/ventura/real/hard-rock.jpg", caption: "Hard Rock Café — historia del rock en cada pared.", category: "Gastronomía", order: 7 },
      { title: "Escaleras al cielo", image: "/images/ventura/real/interior-escalators.jpg", caption: "Cada nivel te lleva a un mundo nuevo por descubrir.", category: "Moda", order: 8 },
      { title: "Café con personalidad", image: "/images/ventura/real/coffee-shop.jpg", caption: "El rincón perfecto para una pausa que vale oro.", category: "Gastronomía", order: 9 },
      { title: "El frente del sabor", image: "/images/ventura/real/coffee-storefront.jpg", caption: "Tiendas con carácter, cada una con su historia.", category: "Arquitectura", order: 10 },
      { title: "Adidas: imposible is nothing", image: "/images/ventura/real/adidas-store.jpg", caption: "Las marcas que movés, a un paso de vos.", category: "Moda", order: 11 },
      { title: "Tecnología que conecta", image: "/images/ventura/real/huawei-corridor.jpg", caption: "Los pasillos donde el futuro se hace presente.", category: "Tecnología", order: 12 },
    ]});
    console.log("  ✓ 12 gallery items");
  }

  if ((await db.movie.count()) === 0) {
    await db.movie.createMany({ data: [
      { title: "Dune: Parte Tres", format: "IMAX", genre: "Ciencia Ficción", duration: 165, rating: "PG-13", poster: "/images/ventura/real/cinemark-screen.jpg", synopsis: "La épica conclusión de la saga Dune. Solo en IMAX sentís la arena bajo tus pies.", showtimes: JSON.stringify(["14:30", "17:00", "19:30", "22:00"]), ticketUrl: "https://www.cinemark.com.bo", featured: true, order: 1 },
      { title: "Avatar: Fuego y Ceniza", format: "3D", genre: "Aventura", duration: 192, rating: "PG-13", poster: "/images/ventura/real/cinemark-posters.jpg", synopsis: "Regresá a Pandora. Una nueva aventura visual que redefine lo posible en pantalla.", showtimes: JSON.stringify(["15:00", "18:15", "21:30"]), ticketUrl: "https://www.cinemark.com.bo", featured: true, order: 2 },
      { title: "Mario Bros: La Película 2", format: "DUB", genre: "Animación", duration: 98, rating: "ATP", poster: "/images/ventura/real/cinemark-lobby.jpg", synopsis: "Diversión para toda la familia. El fontanero más famoso del mundo vuelve a la pantalla.", showtimes: JSON.stringify(["11:00", "13:15", "15:30", "17:45"]), ticketUrl: "https://www.cinemark.com.bo", featured: false, order: 3 },
    ]});
    console.log("  ✓ 3 movies");
  }

  if ((await db.faqItem.count()) === 0) {
    await db.faqItem.createMany({ data: [
      { question: "¿Cuáles son los horarios?", answer: "Los locales abren de lunes a sábado de 10:00 a 22:00 y domingos de 11:00 a 22:00. El patio de comida y boulevard abren todos los días de 11:00 a 23:00. ¿Llegaste tarde? El boulevard te espera.", category: "General", order: 1 },
      { question: "¿Dónde estaciono?", answer: "Tenemos 1,500 parqueos distribuidos en subsuelo, playa principal y boulevard. Y sí, es gratuito para visitantes. Estacioná una vez y olvidate del auto todo el día.", category: "Servicios", order: 2 },
      { question: "¿Tienen carga para eléctricos?", answer: "Sí. Estaciones de carga ENDE Corporación en el subsuelo, disponibles durante todo el horario de atención. Cargá tu auto mientras cargás vos con un café.", category: "Servicios", order: 3 },
      { question: "¿Hay cajeros automáticos?", answer: "Por supuesto. ATM de varios bancos en Nivel 1 y Nivel 2, cerca de los locales bancarios. Tu dinero siempre a mano.", category: "Servicios", order: 4 },
      { question: "¿Objetos perdidos?", answer: "El servicio está en el módulo de información del Nivel 1. También podés escribirnos a info@venturamall.bo. Si lo perdiste acá, hay buenas chances de que aparezca.", category: "Servicios", order: 5 },
      { question: "¿Es accesible?", answer: "100%. Rampas, ascensores, baños accesibles y parqueos reservados para personas con discapacidad en todos los niveles. Ventura es para todos.", category: "Accesibilidad", order: 6 },
      { question: "¿Cómo compro entradas de cine?", answer: "En taquilla o en cinemark.com.bo. 13 salas, 4 VIP y 1 IMAX. Lo que veas, lo vas a sentir.", category: "Entretenimiento", order: 7 },
      { question: "¿Puedo festejar mi cumple?", answer: "¡Claro que sí! Tenemos promociones especiales de cumpleaños. Escribínos a info@venturamall.bo y armamos algo inolvidable.", category: "Eventos", order: 8 },
    ]});
    console.log("  ✓ 8 FAQs");
  }

  console.log("\n✅ Seed complete!");
  await db.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
