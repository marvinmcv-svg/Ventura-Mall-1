import type { Variants } from "framer-motion";

/** Signature easings — expo out for reveals, quart in-out for transitions */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** Fade + rise — the workhorse reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT_EXPO } },
};

export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE_OUT_EXPO } },
};

/** Masked headline reveal — child words rise from behind a clip */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE_OUT_EXPO } },
};

/** Stagger container — children reveal in sequence */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Standard viewport config for whileInView reveals */
export const viewportOnce = { once: true, margin: "-80px" } as const;
export const viewportSoft = { once: true, margin: "-40px" } as const;

/** Reduced-motion aware transition helper */
export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
