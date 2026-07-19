"use client";

import { useRef } from "react";
import { ArrowRight, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useContent } from "@/lib/content-context";
import {
  Reveal,
  SectionHeading,
  MagneticButton,
  GrainOverlay,
} from "@/components/site/primitives";
import { cn } from "@/lib/utils";

interface Dish {
  image: string;
  name: string;
  tag: string;
}

/* Curated rail of dining moments — pairs real photos with editorial captions */
const dishes: Dish[] = [
  { image: "/images/ventura/real/boulevard-night.jpg", name: "Boulevard Gourmet", tag: "Cena bajo las estrellas" },
  { image: "/images/ventura/real/hard-rock.jpg", name: "Hard Rock Cafe", tag: "Rock & Grill americano" },
  { image: "/images/ventura/real/food-court-1.jpg", name: "Patio de Comidas", tag: "Comida rápida global" },
  { image: "/images/ventura/real/food-court-sbarro.jpg", name: "Sbarro", tag: "Pizza al slice, NYC style" },
  { image: "/images/ventura/real/coffee-shop.jpg", name: "Café del Atrio", tag: "Café de especialidad" },
  { image: "/images/ventura/real/coffee-storefront.jpg", name: "Juan Valdez Café", tag: "Café 100% colombiano" },
  { image: "/images/ventura/real/telepizza.jpg", name: "Telepizza", tag: "Pizza al horno" },
  { image: "/images/ventura/real/boulevard-night-guitar.jpg", name: "Noches en vivo", tag: "Música y coctelería" },
];

export function Dining() {
  const { content } = useContent();
  const restaurants = content.stores.filter((s) => s.category === "Gastronomía");
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amt = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amt, behavior: "smooth" });
  };

  // Use the greater of the actual restaurant count or a curated floor
  const count = Math.max(restaurants.length, 20);

  return (
    <section
      id="gastronomia"
      className="relative scroll-mt-20 bg-ink text-white overflow-hidden"
    >
      <GrainOverlay />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <SectionHeading
            eyebrow="GASTRONOMÍA"
            title="Un mundo de sabores te espera"
            description="Desde un café colombiano hasta una cena en el Boulevard Gourmet. Un recorrido cinematográfico por las propuestas que hacen de Ventura un destino culinario."
            dark
            accent="gold"
          />
          {/* Scroll controls — desktop */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="grid place-items-center h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="grid place-items-center h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed rail */}
      <Reveal y={40} className="relative z-10">
        <div
          ref={railRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory mask-fade-x scroll-fancy pb-4 px-4 sm:px-6 lg:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {dishes.map((d, i) => (
            <article
              key={d.name}
              data-card
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden rounded-2xl bg-white/5 border border-white/10",
                "w-[80vw] sm:w-[55vw] lg:w-[30vw] xl:w-[28vw]",
                "aspect-[3/4] sm:aspect-[4/5]"
              )}
            >
              <img
                src={d.image}
                alt={d.name}
                loading={i < 2 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

              {/* Index marker */}
              <span className="absolute top-4 right-4 font-mono text-[0.7rem] text-white/40">
                {String(i + 1).padStart(2, "0")} / {String(dishes.length).padStart(2, "0")}
              </span>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-editorial text-gold">
                    <UtensilsCrossed className="h-3 w-3" />
                    {d.tag}
                  </span>
                  <h3 className="mt-2 font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-tight text-white text-shadow-cinematic">
                    {d.name}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* Closing CTA */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pb-28">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <Reveal>
            <p className="text-lg sm:text-xl text-white/70 max-w-md text-pretty">
              <span className="font-display font-bold text-white">
                Más de {count} propuestas
              </span>{" "}
              gastronómicas bajo un mismo techo, abiertas hasta tarde.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <MagneticButton
              asChild
              className="inline-block rounded-full bg-white text-ink hover:bg-white/90 transition-colors"
            >
              <a
                href="#visita"
                className="inline-flex items-center gap-2 px-6 h-12 font-semibold"
              >
                Ver restaurantes
                <ArrowRight className="h-4 w-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
