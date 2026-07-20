"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import { useAdmin } from "@/stores/admin-store";
import { cn } from "@/lib/utils";
import {
  MagneticButton,
  StaggerGroup,
  StaggerItem,
  GrainOverlay,
} from "@/components/site/primitives";
import { EASE_OUT_EXPO } from "@/lib/motion";

const navLinks = [
  { label: "Tiendas", href: "#tiendas" },
  { label: "Experiencias", href: "#experiencias" },
  { label: "Gastronomía", href: "#gastronomia" },
  { label: "Cine", href: "#cine" },
  { label: "Eventos", href: "#eventos" },
  { label: "Promociones", href: "#promociones" },
  { label: "Visita", href: "#visita" },
];

/**
 * SiteHeader — transparent over the hero, condenses to an ivory blur bar on scroll.
 * Left: V mark + Ventura wordmark + tracked micro-label.
 * Center (lg+): inline nav with animated underline.
 * Right: phone + magnetic "Cómo llegar" CTA + full-screen mobile menu trigger.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { content } = useContent();
  const phone = content.settings.phone || "+591 3 3432121";
  const { open: adminOpen } = useAdmin();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: must set mounted=true only on client to avoid SSR mismatch
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => {};
  }, [open]);

  // During SSR and first client render, treat as not-scrolled to match hero overlay.
  const effectiveScrolled = mounted ? scrolled : false;
  const effectiveAdminOpen = mounted ? adminOpen : false;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          effectiveScrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
            : "bg-transparent border-b border-transparent",
          effectiveAdminOpen && "z-30"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Logo / wordmark */}
            <Link
              href="#inicio"
              className="flex items-center group"
              aria-label="Ventura Mall — ir al inicio"
            >
              <img
                src="/ventura-logo.png"
                alt="Ventura Mall"
                className={cn(
                  "h-8 sm:h-9 w-auto transition-all duration-500 group-hover:scale-[1.03]",
                  effectiveScrolled
                    ? "[filter:none]"
                    : "brightness-0 invert drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]"
                )}
              />
            </Link>

            {/* Desktop inline nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navegación principal"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative px-3.5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                    effectiveScrolled
                      ? "text-foreground/70 hover:text-primary"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute left-3.5 right-3.5 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                      effectiveScrolled ? "bg-primary" : "bg-gold"
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className={cn(
                  "hidden md:inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                  effectiveScrolled
                    ? "text-foreground/70 hover:text-primary"
                    : "text-white/85 hover:text-white"
                )}
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{phone}</span>
              </a>

              <MagneticButton asChild className="hidden sm:inline-block">
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 h-10 px-4"
                >
                  <Link href="#visita">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    Cómo llegar
                  </Link>
                </Button>
              </MagneticButton>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
                className={cn(
                  "lg:hidden grid place-items-center h-11 w-11 rounded-xl transition-colors",
                  effectiveScrolled
                    ? "text-foreground hover:bg-foreground/5"
                    : "text-white hover:bg-white/10"
                )}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mounted && open && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="absolute inset-0 bg-ink text-white flex flex-col">
              <GrainOverlay />

              {/* Top bar */}
              <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 h-16 border-b border-white/10">
                <div className="flex items-center">
                  <img src="/ventura-logo.png" alt="Ventura Mall" className="h-8 w-auto brightness-0 invert" />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="grid place-items-center h-11 w-11 rounded-xl text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Big staggered nav */}
              <nav
                className="relative z-10 flex-1 overflow-y-auto scroll-fancy px-5 sm:px-8 py-8 sm:py-10"
                aria-label="Navegación móvil"
              >
                <StaggerGroup
                  as="div"
                  stagger={0.07}
                  delay={0.05}
                  className="flex flex-col gap-1"
                >
                  {navLinks.map((link, i) => (
                    <StaggerItem key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4 sm:gap-5 py-2.5"
                      >
                        <span className="text-[0.7rem] font-semibold uppercase tracking-editorial text-gold/80 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-white/90 group-hover:text-gold transition-colors duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </nav>

              {/* Bottom: phone + CTA */}
              <div className="relative z-10 border-t border-white/10 px-5 sm:px-8 py-6 space-y-4">
                <MagneticButton asChild className="block w-full">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                  >
                    <Link href="#visita" onClick={() => setOpen(false)}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Cómo llegar
                    </Link>
                  </Button>
                </MagneticButton>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
