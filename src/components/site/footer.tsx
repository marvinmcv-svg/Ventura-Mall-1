"use client";
import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock, Heart, Map } from "lucide-react";
import { useContent } from "@/lib/content-context";

export function SiteFooter() {
  const { content } = useContent();
  const { settings } = content;
  const socials = [
    { label: "Instagram", icon: Instagram, href: settings.instagram || "" },
    { label: "Facebook", icon: Facebook, href: settings.facebook || "" },
    { label: "Twitter", icon: Twitter, href: settings.twitter || "" },
  ].filter((s) => s.href);
  const exploreLinks = [
    { label: "Tiendas", href: "#tiendas" }, { label: "Experiencias", href: "#experiencias" },
    { label: "Gastronomía", href: "#gastronomia" }, { label: "Cine", href: "#cine" },
    { label: "Eventos", href: "#eventos" }, { label: "Galería", href: "#galeria" },
    { label: "Promociones", href: "#promociones" }, { label: "Preguntas FAQ", href: "#faq" },
    { label: "Planifica tu visita", href: "#visita" },
  ];
  return (
    <footer className="bg-ink text-white/80 mt-auto">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid gap-10 lg:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="#inicio" className="flex items-center gap-2.5">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-xl shadow-lg">V</span>
                <span className="flex flex-col leading-none">
                  <span className="font-display font-extrabold text-xl text-white">{settings.siteName || "Ventura Mall"}</span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">{settings.tagline || "Santa Cruz · Bolivia"}</span>
                </span>
              </Link>
              <p className="mt-5 text-sm text-white/65 max-w-sm text-pretty leading-relaxed">El centro comercial más grande de Bolivia. Una ciudad bajo techo con moda, gastronomía, cine IMAX y entretenimiento para toda la familia.</p>
              <div className="mt-6 flex items-center gap-2">
                {socials.map((s) => { const Icon = s.icon; return <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid place-items-center h-10 w-10 rounded-xl bg-white/8 hover:bg-primary text-white/80 hover:text-white transition-colors border border-white/10"><Icon className="h-5 w-5" /></a>; })}
                {settings.foursquare && <a href={settings.foursquare} target="_blank" rel="noopener noreferrer" aria-label="Foursquare" className="grid place-items-center h-10 w-10 rounded-xl bg-white/8 hover:bg-primary text-white/80 hover:text-white transition-colors border border-white/10"><Map className="h-5 w-5" /></a>}
              </div>
            </div>
            <div className="lg:col-span-3">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Explorar</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">{exploreLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-white/65 hover:text-gold transition-colors">{l.label}</Link></li>)}</ul>
            </div>
            <div className="lg:col-span-3">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Contacto</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-white/70">{settings.address}<br />{settings.city}</span></li>
                <li><a href={`tel:${(settings.phone || "").replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-white/70 hover:text-gold transition-colors"><Phone className="h-4 w-4 text-primary shrink-0" />{settings.phone}</a></li>
                <li><a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-white/70 hover:text-gold transition-colors break-all"><Mail className="h-4 w-4 text-primary shrink-0" />{settings.email}</a></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Horarios</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-white/70"><span className="block font-semibold text-white/85">Locales</span>Lun–Sáb 10:00–22:00 · Dom 11:00–22:00</span></li>
                <li className="flex items-start gap-2.5"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-white/70"><span className="block font-semibold text-white/85">Patio & Boulevard</span>Todos los días 11:00–23:00</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>© {new Date().getFullYear()} {settings.siteName || "Ventura Mall"}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">Hecho con <Heart className="h-3.5 w-3.5 text-primary fill-primary" /> en Santa Cruz, Bolivia</p>
        </div>
      </div>
    </footer>
  );
}
