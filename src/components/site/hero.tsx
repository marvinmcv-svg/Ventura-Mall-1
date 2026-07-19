"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/content-context";
import {
  ParallaxImage,
  GrainOverlay,
  MagneticButton,
} from "@/components/site/primitives";
import { EASE_OUT_EXPO } from "@/lib/motion";

const SIDE_STATS = [
  { num: "110K", label: "m² construidos" },
  { num: "156", label: "locales" },
  { num: "IMAX", label: "pantalla gigante" },
];

/**
 * Hero — cinematic opener (id="inicio"), min-h-100svh.
 * Full-bleed parallax + ken-burns background, dark gradient + grain,
 * masked per-line kinetic headline (last line gold-gradient), magnetic CTAs,
 * side stat trio (xl+) and an animated scroll cue. SSR-safe via mounted guard.
 */
export function Hero() {
  const { content } = useContent();
  const { settings } = content;
  const heroImage = settings.heroImage || "/images/ventura/real/exterior.jpg";
  const heroTitle = settings.heroTitle || "Donde Santa Cruz\nse encuentra";
  const heroSubtitle = settings.heroSubtitle || "";
  const heroEyebrow = settings.heroEyebrow || "El mall más grande de Bolivia";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 140]);
  const contentY = useTransform(scrollY, [0, 600], [0, -80]);
  const contentOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  const titleLines = heroTitle.split("\n");

  /* ----- Static (SSR + first client render) — no entrance anims ----- */
  if (!mounted) {
    return (
      <section
        id="inicio"
        className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink"
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ventura Mall en Santa Cruz, Bolivia"
            className="h-full w-full object-cover animate-kenburns"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
        <GrainOverlay />

        {/* Side stat trio (xl+) */}
        <div className="absolute top-1/2 right-6 xl:right-10 -translate-y-1/2 hidden xl:flex flex-col gap-5 z-20">
          {SIDE_STATS.map((s) => (
            <div key={s.label} className="text-right">
              <div className="font-display font-extrabold text-3xl text-white/90 text-shadow-cinematic">
                {s.num}
              </div>
              <div className="text-[0.65rem] uppercase tracking-editorial text-white/55 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 pb-14 sm:pb-16 lg:pb-24 pt-28 lg:pt-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-white mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="uppercase tracking-[0.2em] text-[0.65rem] sm:text-[0.7rem] font-semibold">
                {heroEyebrow}
              </span>
            </div>
            <h1 className="font-display font-extrabold tracking-tight text-white text-shadow-cinematic">
              {titleLines.map((line, lineIdx) => (
                <span
                  key={lineIdx}
                  className="block overflow-hidden pb-[0.1em]"
                >
                  <span className="block text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight">
                    {lineIdx === titleLines.length - 1 ? (
                      <span className="text-gradient-gold">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl text-pretty leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/30 text-base h-12 sm:h-14 px-7 sm:px-8 group"
              >
                <a href="#tiendas">
                  Explorar tiendas
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-xl text-base h-12 sm:h-14 px-7 sm:px-8"
              >
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

  /* ----- Motion-enhanced (post-mount) — cinematic entrance + scroll depth ----- */
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-ink"
    >
      {/* Parallax + ken-burns background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 will-change-transform"
      >
        <ParallaxImage
          src={heroImage}
          alt="Ventura Mall en Santa Cruz, Bolivia"
          kenburns
          priority
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dark cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
      {/* Subtle warm color wash for depth */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.218 28) 0%, oklch(0.82 0.13 82) 100%)",
        }}
      />
      <GrainOverlay />

      {/* Side stat trio — entrance slide + scroll fade (xl+) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: EASE_OUT_EXPO }}
        className="absolute top-1/2 right-6 xl:right-10 -translate-y-1/2 hidden xl:block z-20"
      >
        <motion.div
          style={{ opacity: contentOpacity }}
          className="flex flex-col gap-5"
        >
          {SIDE_STATS.map((s) => (
            <div key={s.label} className="text-right">
              <div className="font-display font-extrabold text-3xl text-white/90 text-shadow-cinematic">
                {s.num}
              </div>
              <div className="text-[0.65rem] uppercase tracking-editorial text-white/55 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main content — drifts up + fades on scroll */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 pb-14 sm:pb-16 lg:pb-24 pt-28 lg:pt-32"
      >
        <div className="max-w-4xl">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-white mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="uppercase tracking-[0.2em] text-[0.65rem] sm:text-[0.7rem] font-semibold">
              {heroEyebrow}
            </span>
          </motion.div>

          {/* Headline — masked per-line kinetic reveal */}
          <h1 className="font-display font-extrabold tracking-tight text-white text-shadow-cinematic">
            {titleLines.map((line, lineIdx) => (
              <span
                key={lineIdx}
                className="block overflow-hidden pb-[0.1em]"
              >
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.2 + lineIdx * 0.14,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="block text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight"
                >
                  {lineIdx === titleLines.length - 1 ? (
                    <span className="text-gradient-gold">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT_EXPO }}
            className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl text-pretty leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: EASE_OUT_EXPO }}
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3"
          >
            <MagneticButton asChild>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/30 text-base h-12 sm:h-14 px-7 sm:px-8 group"
              >
                <a href="#tiendas">
                  Explorar tiendas
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </MagneticButton>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-xl text-base h-12 sm:h-14 px-7 sm:px-8"
            >
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
        style={{ opacity: contentOpacity }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors z-10"
        aria-label="Desplázate hacia abajo"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.28em] font-semibold">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
