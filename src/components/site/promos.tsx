"use client";

import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
import {
  SectionHeading,
  Reveal,
  StaggerGroup,
  StaggerItem,
  ParallaxImage,
} from "@/components/site/primitives";
import { fadeUpSm } from "@/lib/motion";

type Accent = "coral" | "gold" | "emerald" | "ink";

const accentBar: Record<Accent, string> = {
  coral: "bg-primary",
  gold: "bg-gold",
  emerald: "bg-emerald",
  ink: "bg-ink",
};

const accentText: Record<Accent, string> = {
  coral: "text-primary",
  gold: "text-gold",
  emerald: "text-emerald",
  ink: "text-ink",
};

const accentChip: Record<Accent, string> = {
  coral: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold",
  emerald: "bg-emerald/15 text-emerald",
  ink: "bg-ink/10 text-ink",
};

const accentEmojiBg: Record<Accent, string> = {
  coral: "bg-primary/10",
  gold: "bg-gold/15",
  emerald: "bg-emerald/15",
  ink: "bg-ink/10",
};

const accentTint: Record<Accent, string> = {
  coral: "from-primary/[0.07]",
  gold: "from-gold/[0.09]",
  emerald: "from-emerald/[0.08]",
  ink: "from-ink/[0.06]",
};

function getAccent(a?: string): Accent {
  if (a === "gold" || a === "emerald" || a === "ink") return a;
  return "coral";
}

export function Promos() {
  const { content } = useContent();
  const promos = content.promos;
  if (!promos.length) return null;

  const [featured, ...rest] = promos;
  const featuredAccent = getAccent(featured.accent);

  return (
    <section
      id="promociones"
      className="relative scroll-mt-20 bg-background py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="PROMOCIONES"
          title="Promociones que no te puedes perder"
          description="Ofertas, descuentos y experiencias que hacen que cualquier día sea el indicado para venir a Ventura."
          className="mb-12 sm:mb-16"
        />

        <StaggerGroup
          stagger={0.08}
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2"
        >
          {/* Featured promo — spans both columns */}
          <StaggerItem variant={fadeUpSm} className="md:col-span-2">
            <article className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10 md:grid md:grid-cols-[1.05fr_1fr]">
              {/* Accent left bar — grows on hover */}
              <span
                className={cn(
                  "absolute left-0 top-0 z-10 h-full w-1 origin-top transition-all duration-500 group-hover:w-1.5",
                  accentBar[featuredAccent]
                )}
              />
              {/* Subtle accent tint */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br to-transparent opacity-70",
                  accentTint[featuredAccent]
                )}
              />

              {/* Image side */}
              {featured.image && (
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
                  <ParallaxImage
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
                    range={40}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink/10" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-editorial text-ink shadow-lg">
                    <Sparkles className="h-3 w-3 fill-current" /> Oferta destacada
                  </div>
                </div>
              )}

              {/* Content side */}
              <div
                className={cn(
                  "relative flex flex-col justify-center p-7 sm:p-9 lg:p-11",
                  !featured.image && "md:col-span-2"
                )}
              >
                {/* Decorative giant emoji watermark when no image */}
                {!featured.image && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none text-[12rem] leading-none opacity-[0.06] transition-transform duration-700 group-hover:scale-110 sm:text-[16rem] lg:text-[20rem]"
                  >
                    {featured.emoji || "🎁"}
                  </span>
                )}
                <div className="relative flex items-center gap-4">
                  <div
                    className={cn(
                      "grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl shadow-sm transition-transform duration-500 group-hover:scale-110",
                      accentEmojiBg[featuredAccent]
                    )}
                  >
                    {featured.emoji || "🎁"}
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center self-start rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
                      accentChip[featuredAccent]
                    )}
                  >
                    {featured.category}
                  </span>
                </div>

                <h3 className="relative mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-balance text-ink sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="relative mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>

                <div className="relative mt-7 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <CalendarDays
                      className={cn("h-4 w-4", accentText[featuredAccent])}
                    />
                    {featured.date}
                  </div>
                  <a
                    href="#"
                    className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary"
                  >
                    Aprovechar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </div>
            </article>
          </StaggerItem>

          {/* Other promos — tall cards with accent left border */}
          {rest.map((p) => {
            const accent = getAccent(p.accent);
            return (
              <StaggerItem key={p.id} variant={fadeUpSm} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/8 sm:p-8">
                  {/* Accent left border — grows on hover */}
                  <span
                    className={cn(
                      "absolute left-0 top-0 z-10 h-full w-1 origin-top transition-all duration-500 group-hover:w-1.5",
                      accentBar[accent]
                    )}
                  />
                  {/* Subtle accent tint on hover */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      accentTint[accent]
                    )}
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className={cn(
                        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110",
                        accentEmojiBg[accent]
                      )}
                    >
                      {p.emoji || "🎁"}
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider",
                        accentChip[accent]
                      )}
                    >
                      {p.category}
                    </span>
                  </div>

                  <h3 className="relative mt-5 font-display text-xl font-bold leading-tight tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="relative mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>

                  <div className="relative mt-auto pt-6">
                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/70">
                        <CalendarDays
                          className={cn("h-3.5 w-3.5", accentText[accent])}
                        />
                        {p.date}
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1",
                          accentText[accent]
                        )}
                      >
                        Ver
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <Reveal delay={0.15} className="mt-12 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Ver todas las promociones
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
