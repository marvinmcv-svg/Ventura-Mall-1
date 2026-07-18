"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Navigation, Car, Plug, Building2, UtensilsCrossed, Wine, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
const hours = [
  { area: "Locales Comerciales", icon: "ShoppingBag", schedule: [{ day: "Lunes a Sábado", time: "10:00 — 22:00" }, { day: "Domingo", time: "11:00 — 22:00" }], accent: "coral" },
  { area: "Patio de Comida", icon: "UtensilsCrossed", schedule: [{ day: "Lunes a Domingo", time: "11:00 — 23:00" }], accent: "gold" },
  { area: "Boulevard Gourmet", icon: "Wine", schedule: [{ day: "Lunes a Domingo", time: "11:00 — 23:00" }], accent: "emerald" },
  { area: "Locales de Servicio", icon: "Building2", schedule: [{ day: "Lunes a Sábado", time: "11:00 — 22:00" }, { day: "Domingo", time: "11:00 — 21:00" }], accent: "ink" },
] as const;
const iconMap: Record<string, typeof Building2> = { Building2, UtensilsCrossed, Wine, ShoppingBag };
const accentMap: Record<string, { bg: string; text: string; ring: string }> = { coral: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/20" }, gold: { bg: "bg-gold/15", text: "text-[#7a4d00]", ring: "ring-gold/30" }, emerald: { bg: "bg-emerald/12", text: "text-emerald", ring: "ring-emerald/20" }, ink: { bg: "bg-ink/8", text: "text-ink", ring: "ring-ink/15" } };
const features = [{ icon: Car, label: "1,500 parqueos", sub: "Subsuelo, playa principal y boulevard" }, { icon: Plug, label: "Carga eléctrica", sub: "Estaciones ENDE para vehículos eléctricos" }, { icon: Building2, label: "4 plantas + 1 subsuelo", sub: "110,000 m² construidos" }];
export function Visit() {
  const { content } = useContent();
  const { settings } = content;
  const lat = settings.lat || "-17.75465396550155";
  const lng = settings.lng || "-63.19979667663574";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  return (
    <section id="visita" className="py-20 lg:py-28 scroll-mt-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><Navigation className="h-3.5 w-3.5" />Planifica tu visita</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Todo lo que necesitas saber antes de venir</h2>
          <p className="mt-4 text-base lg:text-lg text-muted-foreground text-pretty">Horarios, ubicación, parqueo y servicios. Te esperamos en el corazón de Equipetrol Norte.</p>
        </div>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Clock className="h-5 w-5 text-primary" /><h3 className="font-display font-bold text-xl text-ink">Horarios de atención</h3></div>
            <div className="grid sm:grid-cols-2 gap-4">
              {hours.map((h, i) => { const Icon = iconMap[h.icon] ?? Building2; const a = accentMap[h.accent]; return (
                <motion.div key={h.area} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay: i * 0.06 }} whileHover={{ y: -3 }}>
                  <Card className={cn("h-full ring-1", a.ring)}><CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3"><span className={cn("grid place-items-center h-9 w-9 rounded-lg", a.bg)}><Icon className={cn("h-4 w-4", a.text)} /></span><h4 className="font-display font-bold text-sm text-ink">{h.area}</h4></div>
                    <ul className="space-y-1.5">{h.schedule.map((s) => <li key={s.day} className="flex items-start justify-between gap-2 text-xs"><span className="text-muted-foreground">{s.day}</span><span className="font-semibold text-ink text-right">{s.time}</span></li>)}</ul>
                  </CardContent></Card>
                </motion.div>
              ); })}
            </div>
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {features.map((f, i) => { const Icon = f.icon; return (
                <motion.div key={f.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className="rounded-2xl border border-border/70 bg-card p-4 text-center"><Icon className="mx-auto h-6 w-6 text-primary" /><div className="mt-2 font-display font-bold text-sm text-ink">{f.label}</div><div className="text-[0.7rem] text-muted-foreground mt-0.5 leading-tight">{f.sub}</div></motion.div>
              ); })}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-3xl overflow-hidden border border-border/70 bg-card shadow-lg shadow-ink/5">
              <div className="relative aspect-[16/10] bg-muted"><iframe title="Mapa de Ventura Mall" src={embedUrl} className="absolute inset-0 h-full w-full" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
              <div className="p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3"><span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0"><MapPin className="h-5 w-5" /></span><div><div className="font-display font-bold text-ink">{settings.address}</div><div className="text-sm text-muted-foreground">{settings.city}</div></div></div>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"><a href={directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4 mr-1.5" />Cómo llegar</a></Button>
                </div>
              </div>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-4">
              <motion.a href={`tel:${(settings.phone || "").replace(/\s/g, "")}`} whileHover={{ y: -3 }} className="group rounded-2xl border border-border/70 bg-card p-5 hover:shadow-lg transition-all"><span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald/12 text-emerald mb-3"><Phone className="h-5 w-5" /></span><div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Teléfono</div><div className="font-display font-bold text-ink group-hover:text-primary transition-colors">{settings.phone}</div></motion.a>
              <motion.a href={`mailto:${settings.email}`} whileHover={{ y: -3 }} className="group rounded-2xl border border-border/70 bg-card p-5 hover:shadow-lg transition-all"><span className="grid place-items-center h-10 w-10 rounded-xl bg-gold/15 text-[#7a4d00] mb-3"><Mail className="h-5 w-5" /></span><div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Email</div><div className="font-display font-bold text-ink group-hover:text-primary transition-colors text-sm break-all">{settings.email}</div></motion.a>
              <motion.a href={mapsUrl} target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }} className="group rounded-2xl border border-border/70 bg-card p-5 hover:shadow-lg transition-all"><span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3"><CheckCircle2 className="h-5 w-5" /></span><div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Coordenadas</div><div className="font-display font-bold text-ink group-hover:text-primary transition-colors text-sm">{parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}</div></motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
