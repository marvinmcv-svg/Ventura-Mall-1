"use client";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import { SmartMedia } from "@/components/site/smart-media";
import { cn } from "@/lib/utils";
const accentBg: Record<string, string> = { coral: "bg-primary text-primary-foreground", gold: "bg-gold text-ink", emerald: "bg-emerald text-emerald-foreground", ink: "bg-ink text-white" };
function fmtDate(d: string) { try { return new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short" }); } catch { return ""; } }
function fmtTime(d: string) { try { return new Date(d).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; } }
export function Events() {
  const { content } = useContent();
  const events = content.events;
  if (!events.length) return null;
  const featured = events.filter((e) => e.featured).slice(0, 1)[0];
  const rest = events.filter((e) => e.id !== featured?.id).slice(0, 6);
  return (
    <section id="eventos" className="py-20 lg:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><CalendarDays className="h-3.5 w-3.5" />Agenda</span>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Eventos que no te quieres perder</h2>
          </div>
        </div>
        {featured && (
          <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border/70 bg-card shadow-xl shadow-ink/5 mb-8">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] overflow-hidden">
              {featured.image && <SmartMedia src={featured.image} alt={featured.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg", accentBg[featured.accent])}><Star className="h-3 w-3 fill-current" />Destacado</span>
                <span className="inline-flex items-center rounded-full bg-white/90 text-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">{featured.category}</span>
              </div>
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 text-center shadow-lg"><div className="font-display font-extrabold text-2xl text-primary leading-none">{fmtDate(featured.date).split(" ")[0]}</div><div className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">{fmtDate(featured.date).split(" ")[1]}</div></div>
            </div>
            <div className="p-7 lg:p-10 flex flex-col justify-center">
              <h3 className="font-display font-extrabold text-2xl lg:text-3xl text-ink tracking-tight">{featured.title}</h3>
              <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">{featured.description}</p>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/70"><Clock className="h-4 w-4 text-primary" />{fmtTime(featured.date)}{featured.endDate ? ` — ${fmtTime(featured.endDate)}` : ""}</div>
                {featured.location && <div className="flex items-center gap-2 text-foreground/70"><MapPin className="h-4 w-4 text-primary" />{featured.location}</div>}
              </div>
              <Button className="mt-6 w-fit bg-primary hover:bg-primary/90 text-primary-foreground">Reservar lugar<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </motion.article>
        )}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((ev, i) => (
              <motion.article key={ev.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: i * 0.07 }} className="group rounded-2xl border border-border/70 bg-card overflow-hidden hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1 transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">{ev.image && <SmartMedia src={ev.image} alt={ev.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}<span className={cn("absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider shadow", accentBg[ev.accent])}>{ev.category}</span><div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 text-center shadow"><div className="font-display font-extrabold text-lg text-primary leading-none">{fmtDate(ev.date).split(" ")[0]}</div><div className="text-[0.6rem] font-bold uppercase text-muted-foreground">{fmtDate(ev.date).split(" ")[1]}</div></div></div>
                <div className="p-4"><h3 className="font-display font-bold text-base text-ink leading-tight">{ev.title}</h3><p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{ev.description}</p>{ev.location && <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] text-foreground/60"><MapPin className="h-3 w-3 text-primary" />{ev.location}</div>}</div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
