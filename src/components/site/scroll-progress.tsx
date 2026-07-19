"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — ultra-premium 2px scroll indicator fixed at the very top.
 * Gradient: primary → gold → primary. Spring-smoothed scaleX with left origin.
 * SSR-safe: renders a static (scaleX 0) bar pre-mount, motion bar post-mount.
 */
export function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-gold to-primary"
        style={{ transform: "scaleX(0)" }}
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-primary via-gold to-primary"
    />
  );
}
