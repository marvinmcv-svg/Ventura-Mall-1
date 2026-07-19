"use client";
import { MapPin, Phone, Mail, Clock, Navigation, Car, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/content-context";
import {
  SectionHeading,
  Reveal,
  GrainOverlay,
  StaggerGroup,
  StaggerItem,
  MagneticButton,
} from "@/components/site/primitives";
import { fadeUpSm } from "@/lib/motion";

export function Visit() {
  const { content } = useContent();
  const { settings } = content;
  const lat = settings.lat || "-17.75465396550155";
  const lng = settings.lng || "-63.19979667663574";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  const infoCards = [
    {
      icon: MapPin,
      label: "Dirección",
      value: settings.address,
      sub: settings.city,
      href: directionsUrl,
      external: true,
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: settings.phone,
      sub: "Central de atención",
      href: `tel:${(settings.phone || "").replace(/\s/g, "")}`,
      external: false,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      sub: "Escríbenos",
      href: `mailto:${settings.email}`,
      external: false,
    },
    {
      icon: Clock,
      label: "Horarios",
      value: "Lun–Sáb 10:00–22:00",
      sub: "Dom 11:00–22:00",
      href: undefined,
      external: false,
    },
  ];

  return (
    <section id="visita" className="relative scroll-mt-20 bg-ink text-white overflow-hidden">
      <GrainOverlay />
      {/* Ambient warm glow */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <SectionHeading
          eyebrow="VISITA"
          title="Cómo llegar a Ventura Mall"
          description="En el corazón de Equipetrol Norte. Parqueo amplio, acceso vehicular desde el 4to Anillo y peatonal desde Av. San Martín. Te esperamos todos los días."
          dark
          accent="gold"
        />

        <div className="mt-12 lg:mt-16 grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT: MAP */}
          <Reveal className="lg:col-span-7" y={36}>
            <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 h-[400px] sm:h-full min-h-[400px] lg:min-h-[540px] bg-white/5 shadow-2xl shadow-black/40">
              <iframe
                title="Ubicación de Ventura Mall en el mapa"
                src={embedUrl}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Inner ring */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
              {/* Edge gradients to blend with dark section */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/80 via-ink/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink/60 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink/60 to-transparent" />

              {/* Floating location card */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-sm rounded-2xl bg-ink/75 backdrop-blur-md ring-1 ring-white/15 p-4 sm:p-5 shadow-xl">
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-primary-foreground shrink-0 shadow-lg shadow-primary/30">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.65rem] uppercase tracking-editorial text-gold font-semibold">
                      Estás aquí
                    </div>
                    <div className="mt-1 font-display font-bold text-white text-sm sm:text-base leading-snug">
                      {settings.address}
                    </div>
                    <div className="text-white/55 text-xs mt-0.5">{settings.city}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: INFO CARDS + CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <StaggerGroup className="grid sm:grid-cols-2 gap-4" stagger={0.08}>
              {infoCards.map((card) => {
                const Icon = card.icon;
                const inner = (
                  <div className="group h-full rounded-2xl bg-white/[0.04] ring-1 ring-white/10 hover:ring-white/25 hover:bg-white/[0.07] transition-all p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[0.65rem] uppercase tracking-editorial text-white/50 font-semibold">
                        {card.label}
                      </span>
                    </div>
                    <div className="mt-4 font-display font-semibold text-white text-base sm:text-lg leading-snug break-words">
                      {card.value}
                    </div>
                    {card.sub && <div className="mt-1 text-sm text-white/55">{card.sub}</div>}
                  </div>
                );
                return (
                  <StaggerItem key={card.label} variant={fadeUpSm}>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="block h-full"
                        {...(card.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerGroup>

            {/* Magnetic CTA */}
            <Reveal delay={0.2}>
              <MagneticButton
                asChild
                strength={0.4}
                className="block w-full sm:inline-block sm:w-auto"
              >
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors w-full sm:w-auto shadow-xl shadow-primary/30"
                >
                  <Navigation className="h-5 w-5" />
                  <span>Cómo llegar</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </MagneticButton>
            </Reveal>

            {/* Parking info */}
            <Reveal delay={0.3}>
              <div className="flex items-start gap-3 text-sm text-white/55 mt-2">
                <Car className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  1,500 parqueos · Estaciones de carga eléctrica ENDE en subsuelo ·
                  Acceso peatonal 24/7 desde el boulevard.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
