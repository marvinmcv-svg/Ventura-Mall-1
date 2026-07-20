"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GrainOverlay, ParallaxImage, Reveal } from "@/components/site/primitives";
import { lineReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";

const QUOTE_WORDS = [
  "No", "es", "un", "mall.",
  "Es", "el", "lugar", "donde",
  "Santa", "Cruz", "se", "encuentra.",
];
const GOLD_WORDS = new Set(["Santa", "Cruz"]);

export function StorySection() {
  const { content } = useContent();
  const settings = content.settings;
  const aboutText =
    settings.aboutText ||
    "Inaugurado el 30 de enero de 2014, Ventura Mall fue diseñado por el arquitecto Waldo Alborta como una ciudad bajo techo: moda, gastronomía, cine y entretenimiento en el corazón de Equipetrol Norte.";

  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: must set mounted=true only on client to avoid SSR mismatch
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);
  const contentStyle = mounted ? { y: contentY } : undefined;

  const microStats = [
    { label: "Arquitecto", value: settings.architect || "Waldo Alborta" },
    { label: "Inaugurado", value: settings.inaugurated || "Enero 2014" },
    { label: "Área total", value: settings.area || "110,000 m²" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] bg-ink text-white overflow-hidden flex items-center"
    >
      <ParallaxImage
        src="/images/ventura/real/atrium.jpg"
        alt="Atrio central de Ventura Mall, donde la luz natural y el diseño se encuentran"
        className="absolute inset-0 h-full w-full"
        imgClassName="scale-[1.18]"
      />
      <div className="absolute inset-0 bg-ink/70" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/85"
        aria-hidden
      />
      <GrainOverlay />

      <motion.div
        style={contentStyle}
        className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 w-full"
      >
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" aria-hidden />
            <span className="text-[0.7rem] font-semibold uppercase tracking-editorial text-gold">
              Una ciudad bajo techo
            </span>
          </div>
        </Reveal>

        <motion.blockquote
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08, 0.1)}
          className="mt-6 sm:mt-8 font-display font-bold text-white text-4xl sm:text-6xl lg:text-7xl leading-[0.98] text-balance"
        >
          {QUOTE_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.28em]"
            >
              <motion.span
                variants={lineReveal}
                className={cn(
                  "inline-block",
                  GOLD_WORDS.has(word) && "text-gradient-gold"
                )}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.blockquote>

        <Reveal delay={0.2}>
          <p className="mt-8 sm:mt-10 text-white/70 text-lg sm:text-xl max-w-2xl text-pretty leading-relaxed">
            {aboutText}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <dl className="mt-10 sm:mt-12 flex flex-wrap gap-x-8 gap-y-5 sm:gap-x-12">
            {microStats.map((s) => (
              <div key={s.label} className="border-l border-white/15 pl-4 sm:pl-5">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-editorial text-white/40">
                  {s.label}
                </dt>
                <dd className="mt-1.5 font-display font-bold text-white text-base sm:text-lg">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </motion.div>
    </section>
  );
}
