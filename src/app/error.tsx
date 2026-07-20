"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the server console (in production, wire this to Sentry/error tracking)
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink text-white">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "url(/images/ventura/real/atrium.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/75 to-ink/90" />
      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <p className="font-display text-[5rem] sm:text-[7rem] font-extrabold leading-none text-gradient-gold">
          500
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Algo salió mal
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/70 text-pretty">
          Ocurrió un error inesperado en el servidor. Intentá de nuevo en un momento.
          Si el problema persiste, contactanos a{" "}
          <a href="mailto:info@venturamall.bo" className="text-gold underline underline-offset-2">
            info@venturamall.bo
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
