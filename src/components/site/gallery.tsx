"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { isVideoUrl } from "@/components/site/smart-media";
import { cn } from "@/lib/utils";
import {
  SectionHeading,
  ParallaxImage,
  GrainOverlay,
  Reveal,
} from "@/components/site/primitives";
import { EASE_OUT_EXPO, viewportOnce } from "@/lib/motion";

/** Editorial span rhythm — cycles through 9 tile shapes for a curated masonry feel. */
const SPAN_PATTERNS = [
  "col-span-2 row-span-2 lg:col-span-6 lg:row-span-2",
  "col-span-1 row-span-1 lg:col-span-3 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-3 lg:row-span-1",
  "col-span-2 row-span-1 lg:col-span-4 lg:row-span-1",
  "col-span-1 row-span-2 lg:col-span-4 lg:row-span-2",
  "col-span-1 row-span-1 lg:col-span-4 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-2 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-4 lg:row-span-1",
  "col-span-2 row-span-1 lg:col-span-6 lg:row-span-1",
];

function TileMedia({ src, alt }: { src: string; alt: string }) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        muted
        autoPlay
        loop
        playsInline
        aria-label={alt}
        className="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
      />
    );
  }
  return (
    <ParallaxImage
      src={src}
      alt={alt}
      className="h-full w-full"
      imgClassName="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
      range={36}
    />
  );
}

export function Gallery() {
  const { content } = useContent();
  const { settings } = content;
  const items = content.gallery;
  const [active, setActive] = useState<number | null>(null);

  if (!items.length) return null;

  const open = (i: number) => setActive(i);
  const close = () => setActive(null);
  const prev = () =>
    setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () =>
    setActive((i) => (i === null ? null : (i + 1) % items.length));

  return (
    <section
      id="galeria"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-white sm:py-28 lg:py-32"
    >
      <GrainOverlay className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-soft-light" />

      {/* Subtle top + bottom fades to ease section transitions */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={settings.galleryEyebrow || "GALERÍA"}
          title={settings.galleryTitle || "Un vistazo a la experiencia Ventura"}
          description={settings.galleryDescription || "Luces del boulevard, reflejos en el mármol, texturas del diseño. Cada rincón de Ventura fue pensado para sentirse como una película."}
          dark
          className="mb-12 sm:mb-16"
        />

        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:grid-cols-12">
          {items.map((g, i) => {
            const span = SPAN_PATTERNS[i % SPAN_PATTERNS.length];
            return (
              <motion.button
                key={g.id}
                type="button"
                onClick={() => open(i)}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{
                  duration: 0.75,
                  delay: (i % 6) * 0.06,
                  ease: EASE_OUT_EXPO,
                }}
                className={cn(
                  "group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left",
                  span
                )}
                aria-label={`Abrir imagen: ${g.title}`}
              >
                <TileMedia src={g.image} alt={g.title} />

                {/* Always-on subtle bottom gradient for legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Category chip */}
                {g.category && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors group-hover:bg-white/20">
                    {g.category}
                  </span>
                )}

                {/* Plus icon — appears on hover */}
                <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <Plus className="h-4 w-4" />
                </span>

                {/* Caption slides up */}
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <div className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                    {g.title}
                  </div>
                  {g.caption && (
                    <div className="mt-1 line-clamp-2 text-[0.78rem] leading-snug text-white/70">
                      {g.caption}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-editorial text-white/50">
            {items.length} momentos · hecho en Santa Cruz
          </p>
        </Reveal>
      </div>

      {/* Premium lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Visor de galería"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:left-6 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 sm:right-6 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex max-h-[88vh] max-w-5xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideoUrl(items[active].image) ? (
                <video
                  src={items[active].image}
                  className="max-h-[74vh] max-w-full rounded-2xl object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={items[active].image}
                  alt={items[active].title}
                  className="max-h-[74vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
              )}
              <figcaption className="mt-5 max-w-2xl text-center">
                <div className="font-display text-lg font-bold text-white sm:text-xl">
                  {items[active].title}
                </div>
                {items[active].caption && (
                  <div className="mt-1.5 text-sm leading-relaxed text-white/70">
                    {items[active].caption}
                  </div>
                )}
                <div className="mt-3 text-[0.7rem] font-semibold uppercase tracking-editorial text-gold">
                  {active + 1} / {items.length}
                </div>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
