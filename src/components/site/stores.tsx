"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
const categories = ["Todas", "Moda", "Gastronomía", "Entretenimiento", "Hogar", "Servicios", "Tecnología"] as const;
const accentMap: Record<string, string> = { Moda: "bg-primary/10 text-primary", Gastronomía: "bg-gold/15 text-[#7a4d00]", Entretenimiento: "bg-emerald/15 text-emerald", Hogar: "bg-rose-100 text-rose-700", Servicios: "bg-ink/10 text-ink", Tecnología: "bg-blue-100 text-blue-700" };
export function Stores() {
  const { content } = useContent();
  const stores = content.stores;
  const [active, setActive] = useState<(typeof categories)[number]>("Todas");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => stores.filter((s) => { const matchCat = active === "Todas" || s.category === active; const q = query.trim().toLowerCase(); const matchQuery = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q); return matchCat && matchQuery; }), [stores, active, query]);
  const availableCats = useMemo(() => { const present = new Set(stores.map((s) => s.category)); return categories.filter((c) => c === "Todas" || present.has(c as any)); }, [stores]);
  const featured = stores.filter((s) => s.featured).slice(0, 4);
  return (
    <section id="tiendas" className="py-20 lg:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><StoreIcon className="h-3.5 w-3.5" />Directorio de tiendas</span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Tus marcas favoritas, todas en un solo lugar</h2>
            <p className="mt-4 text-base lg:text-lg text-muted-foreground text-pretty">{stores.length}+ locales con las mejores marcas internacionales y locales. Explora nuestro directorio por categoría.</p>
          </div>
          <div className="relative w-full lg:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tiendas..." className="pl-9 h-11 bg-card border-border/70" aria-label="Buscar tiendas" /></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {availableCats.map((cat) => (<button key={cat} onClick={() => setActive(cat)} className={cn("px-4 py-2 rounded-full text-sm font-semibold transition-all border", active === cat ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-card text-foreground/70 border-border/70 hover:border-primary/40 hover:text-primary")}>{cat}</button>))}
        </div>
        {active === "Todas" && !query && featured.length > 0 && (
          <div className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((s, i) => (<motion.div key={`feat-${s.id}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} whileHover={{ y: -4 }} className={cn("relative overflow-hidden rounded-2xl p-5 lg:p-6 min-h-[140px] flex flex-col justify-between shadow-lg", s.color, s.textOn === "light" ? "text-white" : "text-ink")}>
              <div className="flex items-center justify-between"><Sparkles className="h-5 w-5 opacity-80" /><span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">Destacado</span></div>
              <div><div className="font-display font-extrabold text-2xl tracking-tight">{s.name}</div><div className="text-xs opacity-80 mt-0.5">{s.level}</div></div>
              <div className="pointer-events-none absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-white/15 blur-xl" />
            </motion.div>))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <motion.div layout key={s.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25, delay: (i % 6) * 0.03 }} whileHover={{ y: -3 }} className="group relative rounded-2xl border border-border/70 bg-card overflow-hidden hover:shadow-xl hover:shadow-ink/5 transition-all">
                <div className="flex items-stretch">
                  <div className={cn("relative w-24 sm:w-28 shrink-0 grid place-items-center p-3", s.color, s.textOn === "light" ? "text-white" : "text-ink")}><span className="font-display font-extrabold text-xl lg:text-2xl text-center leading-tight">{s.name.slice(0, 2).toUpperCase()}</span></div>
                  <div className="flex-1 p-4 lg:p-5 min-w-0">
                    <div className="flex items-start justify-between gap-2"><h3 className="font-display font-bold text-lg text-ink leading-tight truncate">{s.name}</h3><Badge variant="secondary" className={cn("shrink-0 text-[0.65rem] font-semibold", accentMap[s.category])}>{s.category}</Badge></div>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-foreground/60"><MapPin className="h-3.5 w-3.5 text-primary" />{s.level}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (<div className="text-center py-16"><div className="mx-auto mb-4 grid place-items-center h-14 w-14 rounded-full bg-muted"><Search className="h-6 w-6 text-muted-foreground" /></div><p className="text-muted-foreground">No encontramos tiendas para "<span className="font-semibold text-ink">{query}</span>".</p><Button variant="ghost" size="sm" className="mt-3" onClick={() => { setQuery(""); setActive("Todas"); }}>Limpiar búsqueda</Button></div>)}
      </div>
    </section>
  );
}
