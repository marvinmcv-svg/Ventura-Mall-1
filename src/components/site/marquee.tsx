"use client";

import { useContent } from "@/lib/content-context";
import { Marquee as MarqueeRail } from "@/components/site/primitives";

const FALLBACK_ITEMS = [
  "110.000 m² de experiencias",
  "156 locales",
  "Sala IMAX · Cinemark",
  "Boulevard nocturno",
  "Food court gourmet",
  "Estacionamiento gratuito",
];

/**
 * Marquee — premium bold ticker band on deep ink.
 * Uses the shared Marquee primitive (dual-copy seamless loop + edge fade mask).
 * Gold ✦ separators between items. Continues the dark rhythm from the hero.
 */
export function Marquee() {
  const { content } = useContent();
  let items: string[] = [];
  try {
    items = JSON.parse(content.settings.marqueeItems || "[]");
  } catch {
    items = [];
  }
  if (!items.length) items = FALLBACK_ITEMS;

  return (
    <section
      aria-label="Highlights"
      className="relative bg-ink text-white border-y border-white/10"
    >
      {/* Top hairline gold accent */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
      <MarqueeRail speed={38} pauseOnHover className="py-4 sm:py-5">
        {items.map((it, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 sm:gap-7 px-5 sm:px-7 font-display text-xl sm:text-3xl font-semibold whitespace-nowrap"
          >
            <span className="text-pretty text-white/95">{it}</span>
            <span
              className="text-gold text-base sm:text-lg leading-none select-none"
              aria-hidden
            >
              ✦
            </span>
          </span>
        ))}
      </MarqueeRail>
    </section>
  );
}
