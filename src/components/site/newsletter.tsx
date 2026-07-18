"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, Loader2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: name || null }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "No pudimos procesar tu suscripción.");
      setDone(true);
      toast({ title: "¡Suscripción confirmada!", description: data.message });
      setEmail(""); setName("");
    } catch (err) { const msg = err instanceof Error ? err.message : "Error inesperado"; toast({ variant: "destructive", title: "Algo salió mal", description: msg }); }
    finally { setLoading(false); }
  };
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-[2rem] bg-ink text-white p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-emerald/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gold"><Gift className="h-3.5 w-3.5" />Promociones exclusivas</span>
              <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">Únete al club Ventura y recibe <span className="text-gold">beneficios únicos</span></h2>
              <p className="mt-4 text-white/75 text-base lg:text-lg text-pretty max-w-xl">Sé el primero en conocer nuestras ventas privadas, eventos, estrenos de cine y promociones especiales de tus marcas favoritas.</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">{["Ventas privadas VIP", "Estrenos de cine", "Eventos exclusivos"].map((b) => <li key={b} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-gold" />{b}</li>)}</ul>
            </div>
            <div className="lg:pl-6">
              {done ? (
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-8 text-center">
                  <div className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-emerald text-emerald-foreground mb-4"><CheckCircle2 className="h-7 w-7" /></div>
                  <h3 className="font-display font-bold text-xl text-white">¡Bienvenido al club!</h3>
                  <p className="mt-2 text-sm text-white/75">Revisa tu correo para confirmar tu suscripción y empezar a recibir beneficios.</p>
                  <Button variant="secondary" className="mt-5 bg-white text-ink hover:bg-white/90" onClick={() => setDone(false)}>Suscribir otro correo</Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 lg:p-7 space-y-4">
                  <div><label htmlFor="nl-name" className="text-xs font-semibold text-white/80 mb-1.5 block">Nombre (opcional)</label><Input id="nl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 focus-visible:ring-gold" /></div>
                  <div><label htmlFor="nl-email" className="text-xs font-semibold text-white/80 mb-1.5 block">Correo electrónico</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" /><Input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 pl-9 focus-visible:ring-gold" /></div></div>
                  <Button type="submit" disabled={loading} className="w-full h-11 bg-gold text-ink hover:bg-gold/90 font-semibold">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Suscribiendo...</> : <><span>Suscribirme</span><Send className="ml-2 h-4 w-4" /></>}</Button>
                  <p className="text-[0.7rem] text-white/55 text-center">Al suscribirte aceptas recibir comunicaciones de Ventura Mall. Puedes darte de baja cuando quieras.</p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
