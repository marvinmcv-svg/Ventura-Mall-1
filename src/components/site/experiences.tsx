"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { SmartMedia } from "@/components/site/smart-media";
import { cn } from "@/lib/utils";
const accentBg: Record<string, string> = { coral: "bg-primary text-primary-foreground", gold: "bg-gold text-ink", emerald: "bg-emerald text-emerald-foreground", ink: "bg-ink text-white" };
const accentText: Record<string, string> = { coral: "text-primary", gold: "text-[#9a6700]", emerald: "text-emerald", ink: "text-ink" };
export function Experiences() {
  const { content } = useContent();
  const experiences = content.experiences;
  if (!experiences.length) return null;
  return (
    <section id="experiencias" className="relative py-20 lg:py-28 scroll-mt-20 bg-gradient-to-b from-muted/40 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald/15 text-emerald px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><ArrowUpRight className="h-3.5 w-3.5" />Más que compras</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Experiencias que van más allá del shopping</h2>
          <p className="mt-4 text-base lg:text-lg text-muted-foreground text-pretty">Desde una sala IMAX hasta una noche en el Boulevard Gourmet. Ventura Mall es un destino para vivir momentos inolvidables.</p>
        </div>
        <div className="space-y-6 lg:space-y-8">
          {experiences.map((exp, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.article key={exp.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden border border-border/70 bg-card shadow-lg shadow-ink/5">
                <div className={cn("relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[340px] overflow-hidden", reversed && "lg:order-2")}>
                  <SmartMedia src={exp.image} alt={exp.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  <span className={cn("absolute top-4 left-4 inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg", accentBg[exp.accent])}>{exp.badge}</span>
                </div>
                <div className={cn("lg:col-span-5 p-7 lg:p-10 flex flex-col justify-center", reversed && "lg:order-1")}>
                  <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", accentText[exp.accent])}>{exp.subtitle}</div>
                  <h3 className="mt-2 font-display font-extrabold text-2xl lg:text-3xl text-ink tracking-tight">{exp.title}</h3>
                  <p className="mt-3 text-muted-foreground text-pretty leading-relaxed">{exp.description}</p>
                  <ul className="mt-5 space-y-2">
                    {exp.highlights.map((h) => (<motion.li key={h} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center gap-2.5 text-sm"><span className={cn("grid place-items-center h-5 w-5 rounded-full shrink-0", accentBg[exp.accent])}><Check className="h-3 w-3" /></span><span className="text-foreground/80">{h}</span></motion.li>))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
