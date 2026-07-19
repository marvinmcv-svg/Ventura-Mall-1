"use client";

import { useContent } from "@/lib/content-context";
import {
  Reveal,
  SplitText,
  SectionHeading,
  ParallaxImage,
} from "@/components/site/primitives";
import { cn } from "@/lib/utils";

/* Accent → token maps (no -foreground suffix on brand tokens; keep SSR-safe) */
const accentBadge: Record<string, string> = {
  coral: "bg-primary text-primary-foreground",
  gold: "bg-gold text-ink",
  emerald: "bg-emerald text-white",
  ink: "bg-ink text-white",
};
const accentText: Record<string, string> = {
  coral: "text-primary",
  gold: "text-gold",
  emerald: "text-emerald",
  ink: "text-ink",
};
const accentMarker: Record<string, string> = {
  coral: "bg-primary",
  gold: "bg-gold",
  emerald: "bg-emerald",
  ink: "bg-ink",
};

export function Experiences() {
  const { content } = useContent();
  const experiences = content.experiences;
  if (!experiences.length) return null;

  return (
    <section id="experiencias" className="relative scroll-mt-20 bg-background">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16">
        <SectionHeading
          eyebrow="EXPERIENCIAS"
          title="Experiencias que van más allá del shopping"
          description="Desde una sala IMAX hasta una noche en el Boulevard Gourmet. Ventura Mall es un destino para vivir momentos inolvidables, no solo para comprar."
          accent="red"
        />
      </div>

      {/* Editorial rows */}
      <div className="flex flex-col">
        {experiences.map((exp, i) => {
          const reversed = i % 2 === 1;
          const idx = String(i + 1).padStart(2, "0");
          const badge = accentBadge[exp.accent] ?? accentBadge.coral;
          const txt = accentText[exp.accent] ?? accentText.coral;
          const marker = accentMarker[exp.accent] ?? accentMarker.coral;

          return (
            <div key={exp.id}>
              {i > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="hairline" />
                </div>
              )}
              <article
                className={cn(
                  "group relative py-16 sm:py-24 transition-colors",
                  i % 2 === 1 ? "bg-muted/30" : "bg-background"
                )}
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    {/* Image side */}
                    <div className={cn("relative", reversed && "lg:order-2")}>
                      <Reveal y={36}>
                        <div className="relative h-[68vh] min-h-[440px] sm:min-h-[520px] lg:min-h-[560px] overflow-hidden rounded-2xl shadow-2xl shadow-ink/10">
                          <ParallaxImage
                            src={exp.image}
                            alt={exp.title}
                            className="h-full w-full"
                            imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                            kenburns={i === 0}
                            range={60}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                          <span
                            className={cn(
                              "absolute top-4 left-4 inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-editorial shadow-lg backdrop-blur-sm",
                              badge
                            )}
                          >
                            {exp.badge}
                          </span>
                        </div>
                      </Reveal>
                    </div>

                    {/* Text side */}
                    <div className={cn("relative", reversed && "lg:order-1")}>
                      {/* Ghost chapter number */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-16 sm:-top-20 lg:-top-28 right-0 font-display font-bold leading-none text-foreground/[0.05] select-none text-[7rem] sm:text-[10rem] lg:text-[13rem]"
                      >
                        {idx}
                      </span>

                      <div className="relative">
                        <Reveal delay={0.05}>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "text-[0.7rem] font-semibold uppercase tracking-editorial",
                                txt
                              )}
                            >
                              {exp.subtitle}
                            </span>
                          </div>
                        </Reveal>

                        <SplitText
                          text={exp.title}
                          as="h3"
                          delay={0.1}
                          className="mt-3 font-display font-bold tracking-tight text-balance text-3xl sm:text-4xl lg:text-5xl leading-[1.0] text-foreground"
                        />

                        <Reveal delay={0.15}>
                          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty max-w-xl">
                            {exp.description}
                          </p>
                        </Reveal>

                        {exp.highlights.length > 0 && (
                          <Reveal delay={0.2}>
                            <ul className="mt-7 space-y-3">
                              {exp.highlights.map((h) => (
                                <li
                                  key={h}
                                  className="flex items-center gap-3 text-sm sm:text-base text-foreground/80"
                                >
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full shrink-0",
                                      marker
                                    )}
                                  />
                                  <span className="text-pretty">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </Reveal>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
