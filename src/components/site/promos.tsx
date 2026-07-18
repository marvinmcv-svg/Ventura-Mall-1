"use client";
import { motion } from "framer-motion";
import { Tag, CalendarDays } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
const accentMap: Record<string, { card: string; chip: string; ring: string }> = {
  coral: { card: "from-primary/10 to-primary/0", chip: "bg-primary text-primary-foreground", ring: "ring-primary/20" },
  gold: { card: "from-gold/15 to-gold/0", chip: "bg-gold text-ink", ring: "ring-gold/30" },
  emerald: { card: "from-emerald/12 to-emerald/0", chip: "bg-emerald text-emerald-foreground", ring: "ring-emerald/20" },
  ink: { card: "from-ink/10 to-ink/0", chip: "bg-ink text-white", ring: "ring-ink/15" },
};
export function Promos() {
  const { content } = useContent();
  const promos = content.promos;
  if (!promos.length) return null;
  return (
    <section id="promociones" className="py-20 lg:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><Tag className="h-3.5 w-3.5" />Novedades & Promociones</span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Promociones que no te puedes perder</h2>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground text-pretty">Aprovecha las mejores ofertas, eventos y experiencias que Ventura Mall tiene para ti.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {promos.map((p, i) => { const a = accentMap[p.accent] || accentMap.coral; return (
            <motion.article key={p.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -5 }} className={cn("group relative rounded-3xl bg-card border border-border/70 p-6 lg:p-7 overflow-hidden hover:shadow-xl hover:shadow-ink/5 transition-all ring-1", a.ring)}>
              <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-80", a.card)} />
              <div className="flex items-start justify-between">
                <motion.div whileHover={{ scale: 1.15, rotate: 8 }} className="grid place-items-center h-14 w-14 rounded-2xl bg-card shadow-md text-3xl">{p.emoji}</motion.div>
                <span className={cn("text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", a.chip)}>{p.category}</span>
              </div>
              <h3 className="mt-5 font-display font-extrabold text-xl text-ink leading-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{p.description}</p>
              <div className="mt-5 pt-4 border-t border-border/70 flex items-center gap-2 text-xs font-semibold text-foreground/70"><CalendarDays className="h-3.5 w-3.5" />{p.date}</div>
            </motion.article>
          ); })}
        </div>
      </div>
    </section>
  );
}
