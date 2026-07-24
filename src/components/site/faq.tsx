"use client";
import { useState, useMemo } from "react";
import { ArrowRight, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useContent } from "@/lib/content-context";
import {
  SectionHeading,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/site/primitives";
import { fadeUpSm } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Faq() {
  const { content } = useContent();
  const { settings } = content;
  const faqs = content.faqs;
  const [active, setActive] = useState<string>("Todas");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));
    return ["Todas", ...cats];
  }, [faqs]);

  const filtered = active === "Todas" ? faqs : faqs.filter((f) => f.category === active);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="scroll-mt-20 bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={settings.faqEyebrow || "FAQ"}
          title={settings.faqTitle || "Todo lo que necesitas saber antes de venir"}
          description={settings.faqDescription || "Respuestas claras a las preguntas que más nos hacen. Si algo te queda en el aire, escríbenos más abajo."}
          align="center"
          accent="red"
        />

        {/* Category filter — slim editorial chips */}
        {categories.length > 1 && (
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={active === cat}
                  className={cn(
                    "h-9 px-4 rounded-lg text-[0.7rem] sm:text-xs font-semibold uppercase tracking-wide-sm transition-all border min-w-[44px]",
                    active === cat
                      ? "bg-ink text-white border-ink shadow-sm"
                      : "bg-card text-foreground/75 border-border hover:border-ink/40 hover:text-ink"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Accordion — clean cards, hover + open affordances */}
        <StaggerGroup className="mt-8 sm:mt-10 space-y-2.5" stagger={0.05}>
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((f) => (
              <StaggerItem key={f.id} variant={fadeUpSm}>
                <AccordionItem
                  value={f.id}
                  className="group rounded-xl border border-border/70 bg-card px-5 sm:px-6 transition-all duration-300 hover:border-ink/25 data-[state=open]:border-primary/40 data-[state=open]:shadow-[0_8px_30px_-12px_oklch(0.55_0.218_28/0.25)] overflow-hidden first:border-t"
                >
                  <AccordionTrigger className="py-5 sm:py-6 text-left hover:no-underline items-center gap-4 [&>svg]:hidden">
                    <span className="flex-1 font-display font-semibold text-base sm:text-lg lg:text-xl text-ink leading-snug pr-2 text-balance">
                      {f.question}
                    </span>
                    <span className="grid place-items-center h-8 w-8 shrink-0 rounded-full border border-border text-ink/60 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                    <div className="border-l-2 border-primary/40 pl-4 sm:pl-5">
                      {f.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
        </StaggerGroup>

        {/* Closing CTA */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex items-center justify-center">
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 text-sm sm:text-base text-foreground/70 hover:text-primary transition-colors text-center"
            >
              <span>¿No encuentras tu respuesta? Escríbenos usando el formulario de contacto.</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
