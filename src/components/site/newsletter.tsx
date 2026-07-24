"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/content-context";
import {
  SplitText,
  Reveal,
  GrainOverlay,
  MagneticButton,
  CounterUp,
} from "@/components/site/primitives";

export function Newsletter() {
  const { content } = useContent();
  const { settings } = content;
  const subscriberCount = content.subscriberCount || 0;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data?.error || "No pudimos procesar tu suscripción.");
      setDone(true);
      toast({ title: "¡Suscripción confirmada!", description: data.message });
      setEmail("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast({ variant: "destructive", title: "Algo salió mal", description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative scroll-mt-20 bg-ink text-white overflow-hidden"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src="/images/ventura/real/boulevard-night.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/60" />
      </div>
      <GrainOverlay />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-gold/20 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-editorial text-gold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Club Ventura
          </span>
        </Reveal>

        <SplitText
          text={settings.newsletterTitle || "Únete al club Ventura"}
          className="mt-6 font-display font-bold tracking-tight text-balance text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.98]"
        />

        <Reveal delay={0.15}>
          <p className="mt-5 text-base sm:text-lg text-white/75 text-pretty max-w-xl mx-auto leading-relaxed">
            {settings.newsletterSubtitle || "Recibe promociones exclusivas, estrenos y eventos antes que nadie."}
          </p>
        </Reveal>

        {/* Social proof */}
        {subscriberCount > 0 && (
          <Reveal delay={0.25}>
            <div className="mt-6 inline-flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex -space-x-2">
                {[
                  { i: "JD", c: "from-primary to-primary/70" },
                  { i: "MR", c: "from-gold to-amber-600" },
                  { i: "AC", c: "from-emerald to-emerald/70" },
                  { i: "PL", c: "from-primary/80 to-rose-700" },
                ].map((p, idx) => (
                  <span
                    key={idx}
                    className={`grid place-items-center h-7 w-7 rounded-full bg-gradient-to-br ${p.c} ring-2 ring-ink text-[0.6rem] font-bold text-white`}
                  >
                    {p.i}
                  </span>
                ))}
              </span>
              <span>
                <span className="font-display font-bold text-white">
                  +<CounterUp to={subscriberCount} />
                </span>{" "}
                suscriptores ya son parte
              </span>
            </div>
          </Reveal>
        )}

        {/* Form */}
        <Reveal delay={0.35}>
          <div className="mt-10">
            {done ? (
              <div className="mx-auto max-w-md rounded-2xl bg-white/[0.06] backdrop-blur border border-white/15 p-8 text-center">
                <div className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-emerald text-emerald-foreground mb-4 shadow-lg shadow-emerald/30">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  ¡Bienvenido al club!
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  Revisa tu correo para confirmar tu suscripción y empezar a recibir
                  beneficios exclusivos.
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
                >
                  Suscribir otro correo
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mx-auto max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center sm:justify-center sm:bg-white/[0.06] sm:backdrop-blur sm:border sm:border-white/15 sm:rounded-full sm:p-1.5 sm:focus-within:ring-2 sm:focus-within:ring-primary/50 sm:transition-all">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    aria-label="Correo electrónico"
                    className="h-14 sm:h-12 flex-1 rounded-full sm:rounded-full bg-white/10 sm:bg-transparent border border-white/20 sm:border-0 text-white placeholder:text-white/50 px-6 sm:px-5 text-base focus-visible:ring-0 focus-visible:border-white/30 sm:focus-visible:border-0"
                  />
                  <MagneticButton
                    asChild
                    strength={0.3}
                    className="block w-full sm:inline-block sm:w-auto shrink-0"
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="group h-14 sm:h-12 px-7 sm:px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base sm:text-sm w-full sm:w-auto shadow-lg shadow-primary/30"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Suscribiendo...
                        </>
                      ) : (
                        <>
                          Suscribirme
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </div>
                <p className="mt-4 text-[0.7rem] text-white/45 max-w-md mx-auto leading-relaxed">
                  Al suscribirte aceptas recibir comunicaciones de Ventura Mall. Puedes
                  darte de baja cuando quieras.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
