"use client";
import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock, Heart, Map } from "lucide-react";
import { useContent } from "@/lib/content-context";
import {
  Marquee,
  GrainOverlay,
  StaggerGroup,
  StaggerItem,
} from "@/components/site/primitives";
import { fadeUpSm } from "@/lib/motion";

export function SiteFooter() {
  const { content } = useContent();
  const { settings } = content;

  const socials = [
    { label: "Instagram", icon: Instagram, href: settings.instagram || "" },
    { label: "Facebook", icon: Facebook, href: settings.facebook || "" },
    { label: "Twitter", icon: Twitter, href: settings.twitter || "" },
  ].filter((s) => s.href);

  const exploreLinks = [
    { label: "Tiendas", href: "#tiendas" },
    { label: "Gastronomía", href: "#gastronomia" },
    { label: "Eventos", href: "#eventos" },
    { label: "Promociones", href: "#promociones" },
    { label: "Planifica tu visita", href: "#visita" },
  ];

  return (
    <footer className="relative bg-ink text-white mt-auto overflow-hidden">
      <GrainOverlay />

      {/* Top wordmark marquee band */}
      <div className="relative z-10 border-b border-white/10 py-6 sm:py-8">
        <Marquee speed={50} className="text-white/[0.06]">
          <span className="font-display font-extrabold text-[13vw] sm:text-[11vw] lg:text-[9vw] leading-none tracking-tight px-6 whitespace-nowrap select-none">
            VENTURA MALL
          </span>
          <span
            aria-hidden
            className="font-display font-extrabold text-[13vw] sm:text-[11vw] lg:text-[9vw] leading-none tracking-tight px-6 whitespace-nowrap text-primary/25 select-none"
          >
            •
          </span>
          <span className="font-display font-extrabold text-[13vw] sm:text-[11vw] lg:text-[9vw] leading-none tracking-tight px-6 whitespace-nowrap select-none">
            VIVE LA EXPERIENCIA
          </span>
          <span
            aria-hidden
            className="font-display font-extrabold text-[13vw] sm:text-[11vw] lg:text-[9vw] leading-none tracking-tight px-6 whitespace-nowrap text-primary/25 select-none"
          >
            •
          </span>
        </Marquee>
      </div>

      {/* Main grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <StaggerGroup
          className="grid gap-12 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {/* Col 1: Brand */}
          <StaggerItem variant={fadeUpSm} className="sm:col-span-2 lg:col-span-1">
            <Link href="#inicio" className="flex items-center gap-3" aria-label="Ventura Mall — ir al inicio">
              <img src="/ventura-logo.png" alt="Ventura Mall" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-editorial text-gold">
              {settings.tagline || "Vive la experiencia"}
            </span>
            <p className="mt-5 text-sm text-white/60 max-w-sm text-pretty leading-relaxed">
              El centro comercial más grande de Bolivia. Una ciudad bajo techo con moda,
              gastronomía, cine y entretenimiento para toda la familia en el corazón de
              Equipetrol Norte.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid place-items-center h-10 w-10 rounded-full bg-white/10 hover:bg-primary text-white/80 hover:text-white transition-all hover:scale-105 border border-white/5"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
              {settings.foursquare && (
                <a
                  href={settings.foursquare}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Foursquare"
                  className="grid place-items-center h-10 w-10 rounded-full bg-white/10 hover:bg-primary text-white/80 hover:text-white transition-all hover:scale-105 border border-white/5"
                >
                  <Map className="h-5 w-5" />
                </a>
              )}
            </div>
          </StaggerItem>

          {/* Col 2: Explorar */}
          <StaggerItem variant={fadeUpSm}>
            <h3 className="font-display font-bold text-white text-[0.7rem] uppercase tracking-editorial mb-5">
              Explorar
            </h3>
            <ul className="space-y-3.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 hover:text-gold transition-colors"
                  >
                    <span className="h-px w-0 group-hover:w-4 bg-gold transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Col 3: Contacto */}
          <StaggerItem variant={fadeUpSm}>
            <h3 className="font-display font-bold text-white text-[0.7rem] uppercase tracking-editorial mb-5">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-white/65 leading-relaxed">
                  {settings.address}
                  <br />
                  {settings.city}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${(settings.phone || "").replace(/\s/g, "")}`}
                  className="flex items-start gap-3 text-white/65 hover:text-gold transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3 text-white/65 hover:text-gold transition-colors break-all"
                >
                  <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </li>
            </ul>
          </StaggerItem>

          {/* Col 4: Horarios */}
          <StaggerItem variant={fadeUpSm}>
            <h3 className="font-display font-bold text-white text-[0.7rem] uppercase tracking-editorial mb-5">
              Horarios
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-white/65 leading-relaxed">
                  <span className="block font-semibold text-white/90 mb-1">
                    Locales comerciales
                  </span>
                  Lun–Sáb 10:00–22:00
                  <br />
                  Dom 11:00–22:00
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-white/65 leading-relaxed">
                  <span className="block font-semibold text-white/90 mb-1">
                    Patio &amp; Boulevard
                  </span>
                  Todos los días 11:00–23:00
                </div>
              </li>
            </ul>
          </StaggerItem>
        </StaggerGroup>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© 2026 {settings.siteName || "Ventura Mall"}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con <Heart className="h-3.5 w-3.5 text-primary fill-primary" /> en Santa
            Cruz, Bolivia
          </p>
        </div>
      </div>
    </footer>
  );
}
