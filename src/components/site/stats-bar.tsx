"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Store, Film, Armchair, Sparkles } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { media } from "@/lib/default-content";

const iconFor = (i: number) => [Building2, Store, Film, Armchair][i % 4];
const defaultStats = [
  { value: 110000, label: "m² construidos", suffix: "+", display: "110,000" },
  { value: 156, label: "locales comerciales", suffix: "", display: "156" },
  { value: 13, label: "salas de cine", suffix: "", display: "13" },
  { value: 1500, label: "butacas", suffix: "+", display: "1,500" },
];

function AnimatedCounter({ value, display }: { value: number; display: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [shown, setShown] = useState("0");
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const start = performance.now(); const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setShown(Math.round(value * eased).toLocaleString("es-BO"));
      if (p < 1) raf = requestAnimationFrame(tick); else setShown(display);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, display]);
  return <span ref={ref}>{shown}</span>;
}

export function StatsBar() {
  const { content } = useContent();
  const investment = content.settings.investment || "$50M";
  const floors = content.settings.floors || "4 + 1";

  return (
    <section id="destacados" className="relative -mt-10 sm:-mt-14 lg:-mt-20 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats card */}
        <div className="rounded-2xl sm:rounded-3xl bg-card/95 backdrop-blur-md shadow-2xl shadow-ink/10 border border-border/60 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/60">
            {defaultStats.map((s, i) => {
              const Icon = iconFor(i);
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative p-5 sm:p-6 lg:p-8 text-center hover:bg-primary/5 transition-colors"
                >
                  <div className="mx-auto mb-3 grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight">
                    <AnimatedCounter value={s.value} display={s.display} />
                    <span className="text-primary">{s.suffix}</span>
                  </div>
                  <div className="mt-1 text-[0.65rem] sm:text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Intro statement */}
        <div className="mt-16 sm:mt-20 lg:mt-28 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 text-[#7a4d00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Una ciudad bajo techo
            </span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance leading-tight">
              El mall más grande de Bolivia, en el corazón de Santa Cruz
            </h2>
            <div className="mt-6 sm:mt-7 grid sm:grid-cols-2 gap-3 sm:gap-4">
              <motion.div whileHover={{ y: -3 }} className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div className="text-xl sm:text-2xl font-display font-extrabold text-primary">{investment}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Inversión inicial</div>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div className="text-xl sm:text-2xl font-display font-extrabold text-primary">{floors}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Plantas + subsuelo</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-ink/20">
              <img src={media.mallInterior} alt="Interior multiplanta de Ventura Mall" className="h-full w-full object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-6 hidden xs:block rounded-xl sm:rounded-2xl bg-emerald text-emerald-foreground p-4 sm:p-5 shadow-xl max-w-[180px] sm:max-w-[220px]"
            >
              <div className="font-display font-extrabold text-xl sm:text-2xl leading-none">{content.stores.length || 156}</div>
              <div className="text-xs sm:text-sm mt-1 opacity-90">locales para descubrir</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 6, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -top-4 -right-3 sm:-top-5 sm:-right-5 hidden sm:flex h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gold items-center justify-center shadow-xl"
            >
              <Film className="h-7 w-7 sm:h-9 sm:w-9 text-ink" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
