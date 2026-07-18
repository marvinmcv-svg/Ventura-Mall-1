"use client";
import { motion } from "framer-motion";
import { Film, Clock, Star, Ticket, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/lib/content-context";
import { SmartMedia, isVideoUrl } from "@/components/site/smart-media";
import { cn } from "@/lib/utils";
const formatColor: Record<string, string> = { IMAX: "bg-ink text-gold", "3D": "bg-primary text-primary-foreground", DUB: "bg-emerald text-emerald-foreground", "2D": "bg-muted text-foreground", XD: "bg-gold text-ink", DBOX: "bg-purple-600 text-white" };
export function Cinema() {
  const { content } = useContent();
  const movies = content.movies;
  if (!movies.length) return null;
  return (
    <section id="cine" className="relative py-20 lg:py-28 scroll-mt-20 bg-ink text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gold"><Clapperboard className="h-3.5 w-3.5" />Cinemark Premier</span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">La cartelera del cine más grande de Bolivia</h2>
            <p className="mt-3 text-white/70 text-pretty">13 salas, 4 VIP y la pantalla IMAX de 16m × 21m. Disfruta el séptimo arte como nunca antes.</p>
          </div>
          <Button asChild variant="secondary" className="bg-gold text-ink hover:bg-gold/90"><a href="https://www.cinemark.com.bo" target="_blank" rel="noopener noreferrer"><Ticket className="h-4 w-4 mr-2" />Comprar entradas</a></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((m, i) => (
            <motion.article key={m.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.08 }} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                {m.poster ? (isVideoUrl(m.poster) ? <video src={m.poster} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" muted /> : <img src={m.poster} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />) : (<div className="grid place-items-center h-full"><Film className="h-12 w-12 text-white/30" /></div>)}
                <span className={cn("absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider shadow-lg", formatColor[m.format] || formatColor["2D"])}>{m.format}</span>
                {m.featured && <span className="absolute top-3 right-3 grid place-items-center h-7 w-7 rounded-full bg-gold text-ink shadow-lg"><Star className="h-3.5 w-3.5 fill-current" /></span>}
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-base text-white leading-tight">{m.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-white/60">{m.genre && <span>{m.genre}</span>}{m.duration && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{m.duration}min</span>}{m.rating && <Badge variant="secondary" className="text-[0.6rem] h-4 px-1.5">{m.rating}</Badge>}</div>
                {m.synopsis && <p className="mt-2 text-xs text-white/55 line-clamp-2">{m.synopsis}</p>}
                {m.showtimes.length > 0 && (<div className="mt-3 flex flex-wrap gap-1.5">{m.showtimes.map((t) => <span key={t} className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-2 py-1 text-[0.7rem] font-semibold text-white/90 group-hover:border-gold/50 group-hover:text-gold transition-colors">{t}</span>)}</div>)}
                {m.ticketUrl && <a href={m.ticketUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"><Ticket className="h-3.5 w-3.5" />Comprar</a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
