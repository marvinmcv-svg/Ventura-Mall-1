"use client";
import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Todo lo que necesitas saber antes de venir"
          description="Respuestas claras a las preguntas que más nos hacen. Si algo te queda en el aire, escríbenos más abajo."
          align="center"
          accent="red"
        />

        {/* Category filter pills */}
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
                    "h-10 px-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide-sm transition-all border min-w-[44px]",
                    active === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-transparent text-foreground/70 border-border hover:border-foreground/40 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Accordion */}
        <StaggerGroup className="mt-10" stagger={0.05}>
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((f) => (
              <StaggerItem key={f.id} variant={fadeUpSm}>
                <AccordionItem
                  value={f.id}
                  className="group border-border/60 border-b first:border-t-0 data-[state=open]:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="py-5 sm:py-6 px-1 sm:px-2 text-left hover:no-underline items-start">
                    <span className="flex-1 font-display font-semibold text-base sm:text-lg lg:text-xl text-ink leading-snug pr-4 text-balance">
                      {f.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 sm:px-2 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
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
