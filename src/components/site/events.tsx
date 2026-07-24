"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
import {
  Reveal,
  SectionHeading,
  ParallaxImage,
  MagneticButton,
} from "@/components/site/primitives";
import { staggerContainer, fadeUpSm, viewportOnce } from "@/lib/motion";

type Accent = "coral" | "gold" | "emerald" | "ink";

const accentText: Record<Accent, string> = {
  coral: "text-primary",
  gold: "text-gold",
  emerald: "text-emerald",
  ink: "text-ink",
};

const accentChip: Record<Accent, string> = {
  coral: "bg-primary text-primary-foreground",
  gold: "bg-gold text-ink",
  emerald: "bg-emerald text-emerald-foreground",
  ink: "bg-ink text-white",
};

const FALLBACK_IMG = "/images/ventura/real/boulevard-night.jpg";

/** SSR-safe mount guard — dates only format on the client to avoid hydration mismatch.
 *  Uses useSyncExternalStore (no setState-in-effect) to return false on server, true on client. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function fmtDay(d: string) {
  try {
    return new Date(d).toLocaleDateString("es-BO", { day: "2-digit" });
  } catch {
    return "—";
  }
}
function fmtMonth(d: string) {
  try {
    return new Date(d)
      .toLocaleDateString("es-BO", { month: "short" })
      .replace(".", "")
      .toUpperCase();
  } catch {
    return "";
  }
}
function fmtTime(d: string) {
  try {
    return new Date(d).toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getAccent(a?: string): Accent {
  if (a === "gold" || a === "emerald" || a === "ink") return a;
  return "coral";
}

export function Events() {
  const { content } = useContent();
  const { settings } = content;
  const events = content.events;
  const mounted = useMounted();

  if (!events.length) return null;

  const featured = events.find((e) => e.featured) ?? events[0];
  const rest = events.filter((e) => e.id !== featured.id).slice(0, 6);

  const featuredAccent = getAccent(featured.accent);
  const featuredImg = featured.image || FALLBACK_IMG;

  return (
    <section
      id="eventos"
      className="relative scroll-mt-20 bg-background py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={settings.eventsEyebrow || "AGENDA"}
          title={settings.eventsTitle || "Eventos que no te quieres perder"}
          description={settings.eventsDescription || "Una cartelera curada de moda, música, cine y cultura en el corazón de Equipetrol. Reserva tu lugar antes de que se agote."}
          className="mb-12 sm:mb-16"
        />

        {/* Featured hero event */}
        {featured && (
          <Reveal y={40} className="mb-16 sm:mb-20">
            <article className="grid overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-2xl shadow-ink/10 lg:grid-cols-[1.05fr_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[460px]">
                <ParallaxImage
                  src={featuredImg}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                  kenburns
                  range={60}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

                {/* Top tags */}
                <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-editorial text-ink shadow-lg">
                    <Sparkles className="h-3 w-3 fill-current" /> Destacado
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider shadow-lg",
                      accentChip[featuredAccent]
                    )}
                  >
                    {featured.category}
                  </span>
                </div>

                {/* Date badge */}
                <div className="absolute bottom-5 left-5 grid h-20 w-20 place-items-center rounded-2xl bg-white/95 text-center shadow-xl backdrop-blur">
                  <div
                    className={cn(
                      "font-display text-3xl font-extrabold leading-none",
                      accentText[featuredAccent]
                    )}
                    suppressHydrationWarning
                  >
                    {mounted ? fmtDay(featured.date) : "—"}
                  </div>
                  <div
                    className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {mounted ? fmtMonth(featured.date) : ""}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-editorial text-gold">
                  <span className="h-px w-6 bg-gold/60" /> Próximo evento
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold leading-[1.02] tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.6rem]">
                  {featured.title}
                </h3>
                <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {featured.description}
                </p>
                <div className="mt-7 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <div className="inline-flex items-center gap-2 text-foreground/80">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium" suppressHydrationWarning>
                      {mounted ? fmtTime(featured.date) : "—"}
                      {featured.endDate
                        ? ` — ${mounted ? fmtTime(featured.endDate) : ""}`
                        : ""}
                    </span>
                  </div>
                  {featured.location && (
                    <div className="inline-flex items-center gap-2 text-foreground/80">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{featured.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <MagneticButton
                    asChild
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
                  >
                    <span>
                      Reservar lugar
                      <ArrowRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </MagneticButton>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* Editorial timeline list */}
        {rest.length > 0 && (
          <div>
            <Reveal className="mb-6 flex items-center gap-4">
              <span className="text-[0.7rem] font-semibold uppercase tracking-editorial text-ink/70">
                Más en agenda
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                {rest.length} próximos
              </span>
            </Reveal>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer(0.07)}
              className="divide-y divide-border/70 border-y border-border/70"
            >
              {rest.map((ev) => {
                const accent = getAccent(ev.accent);
                return (
                  <motion.li key={ev.id} variants={fadeUpSm}>
                    <div className="group relative flex items-center gap-5 rounded-2xl px-2 py-5 transition-colors duration-300 hover:bg-muted/40 sm:gap-8 sm:px-4 sm:py-7">
                      {/* Date block */}
                      <div className="w-16 shrink-0 text-center sm:w-20">
                        <div
                          className={cn(
                            "font-display text-3xl font-extrabold leading-none sm:text-4xl",
                            accentText[accent]
                          )}
                          suppressHydrationWarning
                        >
                          {mounted ? fmtDay(ev.date) : "—"}
                        </div>
                        <div
                          className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                          suppressHydrationWarning
                        >
                          {mounted ? fmtMonth(ev.date) : ""}
                        </div>
                      </div>

                      {/* Vertical accent rule */}
                      <span
                        className={cn(
                          "hidden h-12 w-px shrink-0 origin-top bg-current opacity-20 transition-all duration-300 group-hover:opacity-100 sm:block",
                          accentText[accent]
                        )}
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider",
                              accentChip[accent]
                            )}
                          >
                            {ev.category}
                          </span>
                          {ev.location && (
                            <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {ev.location}
                            </span>
                          )}
                          {ev.endDate && (
                            <span
                              className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground"
                              suppressHydrationWarning
                            >
                              <Clock className="h-3 w-3" />
                              {mounted ? fmtTime(ev.date) : "—"}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-lg font-bold leading-tight text-ink transition-colors group-hover:text-primary sm:text-xl">
                          {ev.title}
                        </h4>
                        <p className="mt-1 line-clamp-1 text-pretty text-sm text-muted-foreground sm:line-clamp-2">
                          {ev.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden shrink-0 items-center sm:flex">
                        <span className="grid h-10 w-10 place-items-center rounded-full border border-border text-ink/60 transition-all duration-300 group-hover:translate-x-1 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <Reveal
              delay={0.1}
              className="mt-8 flex justify-center sm:justify-end"
            >
              <a
                href="#galeria"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
              >
                Ver toda la agenda
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
