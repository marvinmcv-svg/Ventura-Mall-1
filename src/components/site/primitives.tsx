"use client";

import { useState, useEffect, useRef, useSyncExternalStore, ReactNode, ComponentPropsWithoutRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, fadeUpSm, EASE_OUT_EXPO, viewportOnce, lineReveal, staggerContainer } from "@/lib/motion";

/* SSR-safe media query (no setState-in-effect) */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — fade + rise into view on scroll (SSR-safe via whileInView) */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li" | "p" | "section";
  once?: boolean;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT_EXPO, delay } },
      }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* SplitText — word-by-word masked reveal for headlines                */
/* ------------------------------------------------------------------ */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  as = "h2",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const Comp = motion[as] as typeof motion.h2;
  const words = text.split(" ");
  return (
    <Comp
      className={cn("font-display", className)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.28em]">
          <motion.span className={cn("inline-block", wordClassName)} variants={lineReveal}>
            {word}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading — eyebrow + big display title + description          */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
  accent = "red",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  accent?: "red" | "gold";
}) {
  const accentColor = accent === "gold" ? "text-gold" : "text-primary";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
            <span className={cn("h-px w-8", accent === "gold" ? "bg-gold/60" : "bg-primary/60")} />
            <span className={cn("text-[0.7rem] font-semibold uppercase tracking-editorial", accentColor)}>
              {eyebrow}
            </span>
          </div>
        </Reveal>
      )}
      <SplitText
        text={title}
        className={cn(
          "font-display font-bold tracking-tight text-balance text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.98]",
          dark ? "text-white" : "text-foreground"
        )}
      />
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base sm:text-lg leading-relaxed text-pretty",
              align === "center" && "mx-auto",
              dark ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ParallaxImage — scroll-linked y drift + optional Ken Burns          */
/* ------------------------------------------------------------------ */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  kenburns = false,
  range = 80,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  kenburns?: boolean;
  range?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-" + range * 0.4 + "px", range + "px"]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? undefined : "lazy"}
        style={{ y }}
        className={cn("h-full w-full object-cover will-change-transform", kenburns && "animate-kenburns", imgClassName)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MagneticButton — cursor-following CTA (desktop only)                */
/* ------------------------------------------------------------------ */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  asChild = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button"> & { asChild?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  const enabled = useMediaQuery("(pointer: fine)");

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = motion.button;
  if (asChild) {
    // When asChild, render a motion.span wrapper that follows cursor, wrapping children
    return (
      <motion.span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        style={{ x: sx, y: sy }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={cn("inline-block", className)}
        data-cursor="magnet"
      >
        {children}
      </motion.span>
    );
  }
  return (
    <Comp
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      data-cursor="magnet"
      {...(props as object)}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — flexible dual-direction rail with edge fade               */
/* ------------------------------------------------------------------ */
export function Marquee({
  children,
  className,
  reverse = false,
  speed = 40,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden mask-fade-x", className)}>
      <div
        className={cn("flex w-max", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ animationDuration: `${speed}s` }}
        data-pause={pauseOnHover ? "hover" : undefined}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GrainOverlay — cinematic film grain for dark sections               */
/* ------------------------------------------------------------------ */
export function GrainOverlay({ className }: { className?: string }) {
  return <div className={cn("grain-overlay", className)} aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* StaggerGroup — staggered reveal of a list of children               */
/* ------------------------------------------------------------------ */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "section";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </Comp>
  );
}

/** StaggerItem — pair with StaggerGroup; uses fadeUp variant */
export function StaggerItem({
  children,
  className,
  variant = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variants;
}) {
  return (
    <motion.div className={className} variants={variant}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CustomCursor — premium desktop cursor (dot + lagging ring)          */
/* ------------------------------------------------------------------ */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const active = finePointer && !reducedMotion;
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.body.classList.add("custom-cursor-active");

    let rx = window.innerWidth / 2,
      ry = window.innerHeight / 2;
    let mx = rx,
      my = ry;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor], input, textarea, select, [role='button']"));
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [active]);

  if (!active) return null;
  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ width: 6, height: 6, background: "oklch(0.55 0.218 28)", transition: "width .2s, height .2s, opacity .2s", opacity: hovering ? 0 : 1 }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          border: "1.5px solid oklch(0.55 0.218 28 / 0.6)",
          background: hovering ? "oklch(0.55 0.218 28 / 0.08)" : "transparent",
          transition: "width .25s ease, height .25s ease, background .25s ease, border-color .25s ease",
        }}
        aria-hidden
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CounterUp — animated number count when in view                      */
/* ------------------------------------------------------------------ */
export function CounterUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration, started]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("es-BO")}
      {suffix}
    </span>
  );
}
