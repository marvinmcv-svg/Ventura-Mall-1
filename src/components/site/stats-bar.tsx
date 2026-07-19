"use client";

import {
  CounterUp,
  GrainOverlay,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/site/primitives";
import { useContent } from "@/lib/content-context";

/** Extract the first numeric token from a settings string (e.g. "110,000 m²" → 110000). */
function parseFirstNumber(s: string | undefined, fallback: number): number {
  if (!s) return fallback;
  const m = s.match(/\d[\d.,]*/);
  if (!m) return fallback;
  return Number(m[0].replace(/[.,]/g, ""));
}

export function StatsBar() {
  const { content } = useContent();
  const settings = content.settings;

  const areaK = Math.max(1, Math.round(parseFirstNumber(settings.area, 110000) / 1000));
  const storesCount = content.stores.length || 156;
  const floorsNum = Number((settings.floors?.match(/\d/) || ["4"])[0]) || 4;

  const stats = [
    { value: areaK, suffix: "K", label: "m² construidos" },
    { value: storesCount, suffix: "", label: "locales comerciales" },
    { value: 13, suffix: "", label: "salas de cine" },
    { value: floorsNum, suffix: "", label: "plantas + subsuelo" },
  ];

  return (
    <section className="relative bg-ink text-white py-16 sm:py-20 overflow-hidden">
      <GrainOverlay />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" aria-hidden />
              <span className="text-[0.7rem] font-semibold uppercase tracking-editorial text-gold">
                Una ciudad bajo techo
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display font-bold tracking-tight text-balance text-3xl sm:text-4xl lg:text-5xl leading-[1.03]">
              El mall más grande de Bolivia, en el corazón de{" "}
              <span className="text-gradient-gold">Santa Cruz</span>
            </h2>
          </Reveal>
        </div>

        <StaggerGroup
          stagger={0.1}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10"
        >
          {stats.map((s) => (
            <StaggerItem
              key={s.label}
              className="py-7 sm:py-6 sm:px-6 lg:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="font-display font-bold text-4xl lg:text-5xl tracking-tight text-white">
                <CounterUp to={s.value} suffix={s.suffix} duration={1.8} />
              </div>
              <div className="mt-2 text-[0.7rem] sm:text-xs font-medium uppercase tracking-editorial text-white/50">
                {s.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
