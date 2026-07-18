"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useContent } from "@/lib/content-context";

export function StorySection() {
  const { content } = useContent();
  const aboutText = content.settings.aboutText || "";
  const ref = useRef<HTMLElement>(null);

  // Render static HTML during SSR, motion-enhanced after mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Use window scroll (no target ref) to avoid "non-static position" warnings
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 3000], ["-10%", "10%"]);
  const scale = useTransform(scrollY, [0, 3000], [1.05, 1.15]);
  const overlayOpacity = useTransform(scrollY, [0, 1500, 3000], [0.4, 0.3, 0.4]);

  // Static version for SSR
  if (!mounted) {
    return (
      <section ref={ref} className="relative h-[80svh] sm:h-[100svh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src="/images/ventura/real/atrium.jpg" alt="Interior de Ventura Mall" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-gold text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-6">
            Una ciudad bajo techo
          </span>
          <blockquote className="font-display font-extrabold text-white text-2xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-balance">
            "No es un mall.<br />
            Es el lugar donde{" "}
            <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">Santa Cruz</span><br />
            se encuentra."
          </blockquote>
          <p className="mt-6 sm:mt-8 text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-pretty leading-relaxed">
            {aboutText}
          </p>
        </div>
      </section>
    );
  }

  // Motion-enhanced version after mount
  return (
    <section ref={ref} className="relative h-[80svh] sm:h-[100svh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src="/images/ventura/real/atrium.jpg" alt="Interior de Ventura Mall" className="h-full w-full object-cover" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-ink/40" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block text-gold text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-6"
        >
          Una ciudad bajo techo
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-extrabold text-white text-2xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-balance"
        >
          "No es un mall.
          <br />
          Es el lugar donde{" "}
          <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
            Santa Cruz
          </span>
          <br />
          se encuentra."
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 sm:mt-8 text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto text-pretty leading-relaxed"
        >
          {aboutText}
        </motion.p>
      </div>
    </section>
  );
}
