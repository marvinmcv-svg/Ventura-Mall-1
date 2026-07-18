"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { SmartMedia, isVideoUrl } from "@/components/site/smart-media";
import { cn } from "@/lib/utils";
export function Gallery() {
  const { content } = useContent();
  const items = content.gallery;
  const [active, setActive] = useState<number | null>(null);
  if (!items.length) return null;
  const open = (i: number) => setActive(i);
  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  const next = () => setActive((i) => (i === null ? null : (i + 1) % items.length));
  return (
    <section id="galeria" className="py-20 lg:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald/15 text-emerald px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><Images className="h-3.5 w-3.5" />Galería</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Un vistazo a la experiencia Ventura</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((g, i) => (
            <motion.button key={g.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: (i % 4) * 0.05 }} onClick={() => open(i)} className={cn("group relative rounded-2xl overflow-hidden bg-muted hover:shadow-xl transition-all", i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square")}>
              <SmartMedia src={g.image} alt={g.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"><div className="text-sm font-display font-bold text-white">{g.title}</div>{g.caption && <div className="text-[0.7rem] text-white/80 line-clamp-2">{g.caption}</div>}</div>
              <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 text-ink text-[0.6rem] font-bold px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{g.category}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink/90 backdrop-blur-md flex items-center justify-center p-4" onClick={close}>
            <button onClick={close} aria-label="Cerrar" className="absolute top-4 right-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior" className="absolute left-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Siguiente" className="absolute right-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
            <motion.div key={active} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              {isVideoUrl(items[active].image) ? <video src={items[active].image} className="max-h-[75vh] max-w-full rounded-xl object-contain" controls autoPlay playsInline /> : <img src={items[active].image} alt={items[active].title} className="max-h-[75vh] max-w-full rounded-xl object-contain" />}
              <div className="mt-4 text-center"><div className="font-display font-bold text-lg text-white">{items[active].title}</div>{items[active].caption && <div className="text-sm text-white/70 mt-1">{items[active].caption}</div>}<div className="text-xs text-white/50 mt-2">{active + 1} / {items.length}</div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
