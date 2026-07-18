"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";

export function Hero() {
  const { content } = useContent();
  const { settings } = content;
  const heroImage = settings.heroImage || "/images/ventura/real/exterior.jpg";
  const heroTitle = settings.heroTitle || "Donde Santa Cruz\nse encuentra";
  const heroSubtitle = settings.heroSubtitle || "";
  const heroEyebrow = settings.heroEyebrow || "El mall más grande de Bolivia";

  // Render static HTML during SSR, motion-enhanced after mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 180]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.15]);
  const overlayOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const textY = useTransform(scrollY, [0, 400], [0, -80]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const titleLines = heroTitle.split("\n");

  // Before mount: render static version (no motion, no hydration mismatch)
  if (!mounted) {
    return (
      <section id="inicio" className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink/80">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Ventura Mall en Santa Cruz, Bolivia" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20 pt-28 lg:pt-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm font-semibold text-white mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {heroEyebrow}
            </div>
            <h1 className="font-display font-extrabold tracking-tight text-white">
              {titleLines.map((line, lineIdx) => (
                <span key={lineIdx} className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95]">
                  {lineIdx === titleLines.length - 1 ? (
                    <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl text-pretty leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/40 text-base h-12 sm:h-14 px-7 sm:px-8 group">
                <a href="#tiendas">
                  Explorar tiendas
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-xl text-base h-12 sm:h-14 px-7 sm:px-8">
                <a href="#visita">
                  <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // After mount: full motion-enhanced version
  return (
    <section id="inicio" className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink/80">
      {/* Background image with parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImage} alt="Ventura Mall en Santa Cruz, Bolivia" className="h-full w-full object-cover" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-25"
        style={{ background: "linear-gradient(135deg, oklch(0.64 0.215 32) 0%, oklch(0.78 0.16 78) 50%, oklch(0.55 0.13 162) 100%)" }}
      />

      {/* Floating stat badge — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ opacity: textOpacity }}
        className="absolute top-1/2 right-8 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-10"
      >
        {[
          { num: "110K", label: "m² construidos" },
          { num: "156", label: "locales" },
          { num: "IMAX", label: "pantalla gigante" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.15 }}
            className="text-right"
          >
            <div className="font-display font-extrabold text-3xl text-white/90">{s.num}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20 pt-28 lg:pt-32">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-xs sm:text-sm font-semibold text-white mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {heroEyebrow}
          </motion.div>

          {/* Headline — kinetic per-line reveal */}
          <h1 className="font-display font-extrabold tracking-tight text-white">
            {titleLines.map((line, lineIdx) => (
              <span key={lineIdx} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 + lineIdx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95]"
                >
                  {lineIdx === titleLines.length - 1 ? (
                    <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl text-pretty leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/40 text-base h-12 sm:h-14 px-7 sm:px-8 group">
              <a href="#tiendas">
                Explorar tiendas
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-xl text-base h-12 sm:h-14 px-7 sm:px-8">
              <a href="#visita">
                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Cómo llegar
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#destacados"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors z-10"
        aria-label="Desplázate hacia abajo"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
