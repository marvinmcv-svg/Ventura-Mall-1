"use client";

import { Ticket, Clock, Star, Clapperboard, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/content-context";
import {
  Reveal,
  SplitText,
  GrainOverlay,
  MagneticButton,
  StaggerGroup,
  StaggerItem,
  ParallaxImage,
} from "@/components/site/primitives";
import { fadeUpSm } from "@/lib/motion";
import { cn } from "@/lib/utils";

const formatStyle: Record<string, string> = {
  IMAX: "bg-gold text-ink",
  XD: "bg-gold text-ink",
  "3D": "bg-primary text-primary-foreground",
  DUB: "bg-emerald text-white",
  "2D": "bg-white/10 text-white border border-white/20",
  DBOX: "bg-primary text-primary-foreground",
};

const cinemaBackdrops = [
  "/images/ventura/real/cinemark-xd.jpg",
  "/images/ventura/real/cinemark-screen.jpg",
  "/images/ventura/real/cinemark-recliners.jpg",
  "/images/ventura/real/cinemark-seats-purple.jpg",
  "/images/ventura/real/cinemark-lobby.jpg",
  "/images/ventura/real/cinemark-posters.jpg",
];

export function Cinema() {
  const { content } = useContent();
  const movies = content.movies;
  if (!movies.length) return null;

  const featured = movies.find((m) => m.featured) ?? movies[0];
  const others = movies.filter((m) => m.id !== featured.id);
  const featuredBackdrop = featured.poster || cinemaBackdrops[0];

  return (
    <section id="cine" className="relative scroll-mt-20 bg-ink text-white overflow-hidden">
      <GrainOverlay />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/3 h-[40rem] w-[40rem] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Top — billboard intro */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-editorial text-gold">
                <Clapperboard className="h-3.5 w-3.5" />
                Cinemark Premier
              </div>
            </Reveal>
            <SplitText
              text="La cartelera del cine más grande de Bolivia"
              delay={0.05}
              className="mt-5 font-display font-bold tracking-tight text-balance text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] text-white"
            />
            <Reveal delay={0.2}>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl text-pretty">
                13 salas, 4 VIP y la pantalla IMAX de 16m × 21m. El séptimo arte
                como nunca antes lo viviste.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <MagneticButton
              asChild
              className="inline-block rounded-full bg-gold text-ink hover:bg-gold/90 transition-colors"
            >
              <a
                href="https://www.cinemark.com.bo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 font-semibold"
              >
                <Ticket className="h-4 w-4" />
                Comprar entradas
              </a>
            </MagneticButton>
          </Reveal>
        </div>

        {/* Featured hero card */}
        <Reveal y={48}>
          <article className="group relative overflow-hidden rounded-3xl border border-white/10">
            <div className="relative aspect-[16/11] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
              <ParallaxImage
                src={featuredBackdrop}
                alt={featured.title}
                className="h-full w-full"
                imgClassName="transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                kenburns
                range={60}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

              {/* Featured content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-12">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-editorial",
                        formatStyle[featured.format] ?? formatStyle["2D"]
                      )}
                    >
                      {featured.format}
                    </span>
                    {featured.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-editorial text-gold">
                        <Star className="h-3 w-3 fill-current" /> Estreno
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-balance text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] text-white text-shadow-cinematic">
                    {featured.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                    {featured.genre && (
                      <span className="uppercase tracking-wide-sm">{featured.genre}</span>
                    )}
                    {featured.duration != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.duration} min
                      </span>
                    )}
                    {featured.rating && (
                      <span className="inline-flex items-center gap-1.5 border border-white/20 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {featured.rating}
                      </span>
                    )}
                  </div>

                  {featured.synopsis && (
                    <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed line-clamp-3 max-w-xl">
                      {featured.synopsis}
                    </p>
                  )}

                  {featured.showtimes.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {featured.showtimes.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {featured.ticketUrl && (
                    <a
                      href={featured.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
                    >
                      Ver horarios y comprar
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Other movies */}
        {others.length > 0 && (
          <>
            <div className="mt-16 mb-6 flex items-end justify-between">
              <Reveal>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  También en cartelera
                </h3>
              </Reveal>
              <Reveal delay={0.1}>
                <span className="text-xs sm:text-sm text-white/50 font-mono">
                  {String(others.length).padStart(2, "0")} títulos
                </span>
              </Reveal>
            </div>

            <StaggerGroup
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
              stagger={0.08}
            >
              {others.map((m, i) => {
                const poster = m.poster || cinemaBackdrops[i % cinemaBackdrops.length];
                return (
                  <StaggerItem key={m.id} variant={fadeUpSm}>
                    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={poster}
                          alt={m.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90" />

                        <span
                          className={cn(
                            "absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-editorial shadow-lg",
                            formatStyle[m.format] ?? formatStyle["2D"]
                          )}
                        >
                          {m.format}
                        </span>
                        {m.rating && (
                          <span className="absolute top-3 right-3 inline-flex items-center rounded-full border border-white/20 bg-ink/70 px-2 py-0.5 text-[0.65rem] font-bold text-white backdrop-blur-sm">
                            {m.rating}
                          </span>
                        )}

                        {/* Caption */}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h4 className="font-display font-bold text-base sm:text-lg text-white leading-tight text-shadow-cinematic">
                            {m.title}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-white/60">
                            {m.genre && (
                              <span className="uppercase tracking-wide-sm">{m.genre}</span>
                            )}
                            {m.duration != null && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {m.duration}m
                              </span>
                            )}
                          </div>

                          {/* Hover reveal: showtimes slide up */}
                          {m.showtimes.length > 0 && (
                            <div className="mt-3 max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500 ease-out">
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {m.showtimes.slice(0, 4).map((t) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur-sm"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              {m.ticketUrl && (
                                <a
                                  href={m.ticketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-gold hover:text-gold/80 transition-colors"
                                >
                                  <Ticket className="h-3 w-3" /> Comprar
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </>
        )}
      </div>
    </section>
  );
}
