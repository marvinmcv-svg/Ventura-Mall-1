import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/images/ventura/real/exterior.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/90" />
      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <p className="font-display text-[7rem] sm:text-[9rem] font-extrabold leading-none text-gradient-gold">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Esta página se perdió en el mall
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/70 text-pretty">
          La dirección que buscas no existe o fue movida. Volvé al inicio para seguir
          explorando tiendas, gastronomía y experiencias en Ventura Mall.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link
            href="/#tiendas"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Explorar tiendas
          </Link>
        </div>
      </div>
    </main>
  );
}
