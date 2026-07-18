"use client";
import { motion } from "framer-motion";
import { UtensilsCrossed, Coffee, Drumstick, Pizza, Salad, IceCream, Music, ArrowRight, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import { media } from "@/lib/default-content";
const iconForName = (name: string) => { const n = name.toLowerCase(); if (n.includes("starbucks") || n.includes("juan valdez")) return Coffee; if (n.includes("kfc")) return Drumstick; if (n.includes("sbarro") || n.includes("pizza")) return Pizza; if (n.includes("green")) return Salad; if (n.includes("yogurt")) return IceCream; if (n.includes("hard rock")) return Music; return UtensilsCrossed; };
export function Dining() {
  const { content } = useContent();
  const restaurants = content.stores.filter((s) => s.category === "Gastronomía");
  if (!restaurants.length) return null;
  return (
    <section id="gastronomia" className="relative py-20 lg:py-28 scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10"><div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-emerald/10" /></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 text-[#7a4d00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><UtensilsCrossed className="h-3.5 w-3.5" />Gastronomía</span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Un mundo de sabores te espera</h2>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground text-pretty max-w-2xl">Desde un café colombiano hasta una cena en el Boulevard Gourmet. {restaurants.length}+ propuestas gastronómicas para cada antojo y cada momento del día.</p>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ y: -3 }} className="rounded-2xl overflow-hidden aspect-square shadow-lg"><img src={media.foodCourt} alt="Patio de comida en Ventura Mall" className="h-full w-full object-cover" /></motion.div>
              <motion.div whileHover={{ y: -3 }} className="rounded-2xl overflow-hidden aspect-square shadow-lg"><img src={media.cafeInterior} alt="Café moderno en Ventura Mall" className="h-full w-full object-cover" /></motion.div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurants.map((r, i) => { const Icon = iconForName(r.name); return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: (i % 4) * 0.06 }} whileHover={{ y: -4 }} className="group relative rounded-2xl bg-card border border-border/70 overflow-hidden hover:shadow-xl hover:shadow-ink/5 transition-all">
              <div className={`relative h-24 ${r.color} flex items-center justify-center overflow-hidden`}><Icon className={`h-10 w-10 ${r.textOn === "light" ? "text-white" : "text-ink"} opacity-90 group-hover:scale-110 transition-transform`} /><div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15 blur-xl" /></div>
              <div className="p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-display font-bold text-base text-ink leading-tight">{r.name}</h3></div><div className="text-[0.7rem] font-semibold uppercase tracking-wide text-primary mt-0.5">{r.level}</div><p className="mt-2 text-xs text-muted-foreground line-clamp-2">{r.description}</p></div>
            </motion.div>
          ); })}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }} whileHover={{ y: -4 }} className="relative rounded-2xl bg-ink text-white overflow-hidden p-6 flex flex-col justify-between min-h-[200px]">
            <div><Wine className="h-8 w-8 text-gold" /><h3 className="mt-3 font-display font-extrabold text-xl leading-tight">¿Hambriento de más?</h3><p className="mt-1.5 text-sm text-white/70">Descubre todas las opciones del patio de comida y boulevard.</p></div>
            <Button asChild size="sm" className="mt-4 bg-gold text-ink hover:bg-gold/90 w-fit"><a href="#visita">Ver horarios<ArrowRight className="ml-1.5 h-4 w-4" /></a></Button>
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-gold/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
