"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Send, Loader2, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/lib/content-context";
import { useToast } from "@/hooks/use-toast";
export function Faq() {
  const { content } = useContent();
  const faqs = content.faqs;
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data?.ok) { toast({ title: "¡Mensaje enviado!", description: data.message }); setForm({ name: "", email: "", message: "" }); }
      else throw new Error(data?.error);
    } catch (err: any) { toast({ variant: "destructive", title: "Error", description: err.message }); }
    finally { setSending(false); }
  };
  if (!faqs.length) return null;
  const categories = [...new Set(faqs.map((f) => f.category))];
  return (
    <section id="faq" className="py-20 lg:py-28 scroll-mt-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider"><HelpCircle className="h-3.5 w-3.5" />Preguntas frecuentes</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight text-balance">Todo lo que necesitas saber</h2>
          <p className="mt-3 text-muted-foreground text-pretty">¿No encuentras tu respuesta? Escríbenos usando el formulario abajo.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {categories.map((cat) => (
              <div key={cat} className="mb-6">
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider mb-3">{cat}</h3>
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }}>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqs.filter((f) => f.category === cat).map((f) => (
                      <AccordionItem key={f.id} value={f.id} className="rounded-xl border border-border bg-card px-4 data-[state=open]:shadow-md transition-shadow">
                        <AccordionTrigger className="text-left font-semibold text-ink hover:no-underline py-4 [&[data-state=open]>svg]:rotate-180"><span className="flex-1">{f.question}</span><ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" /></AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{f.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }} className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-ink/5">
              <div className="flex items-center gap-2 mb-1"><MessageCircle className="h-5 w-5 text-primary" /><h3 className="font-display font-bold text-lg text-ink">¿Tienes una pregunta?</h3></div>
              <p className="text-sm text-muted-foreground mb-4">Envíanos un mensaje y te responderemos pronto.</p>
              <form onSubmit={submit} className="space-y-3">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" required className="h-10" />
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Tu correo electrónico" required className="h-10" />
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Escribe tu mensaje..." required rows={4} />
                <Button type="submit" disabled={sending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">{sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</> : <><Send className="h-4 w-4 mr-2" />Enviar mensaje</>}</Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
