"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  SectionHeading,
  StaggerGroup,
  StaggerItem,
} from "@/components/site/primitives";
import { fadeUp } from "@/lib/motion";
import { useContent } from "@/lib/content-context";
import { cn } from "@/lib/utils";
import type { StoreItem } from "@/lib/content";

function StoreInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return <>{initials || "V"}</>;
}

function StoreCard({ store }: { store: StoreItem }) {
  const textCol = store.textOn === "light" ? "text-white" : "text-ink";
  const isFeatured = store.featured;

  const visual = (
    <div
      className={cn(
        "relative overflow-hidden grid place-items-center",
        isFeatured ? "h-32 sm:h-auto sm:w-2/5 shrink-0" : "h-20",
        store.color,
        textCol
      )}
    >
      {store.logoUrl ? (
        <img
          src={store.logoUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn(
            "relative font-display font-extrabold tracking-tight",
            isFeatured ? "text-4xl sm:text-5xl" : "text-2xl"
          )}
        >
          <StoreInitials name={store.name} />
        </span>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    </div>
  );

  const body = (
    <div className="flex-1 p-5 sm:p-6 flex flex-col min-w-0">
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            "font-display font-bold text-foreground leading-tight truncate",
            isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          )}
        >
          {store.name}
        </h3>
        <Badge
          variant="outline"
          className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide-sm"
        >
          {store.category}
        </Badge>
      </div>
      <p
        className={cn(
          "mt-2 text-sm text-muted-foreground",
          isFeatured ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-2"
        )}
      >
        {store.description}
      </p>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {store.level}
        </span>
        {store.website && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-1.5">
            Visitar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );

  const article = (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 hover:border-border">
      {isFeatured ? (
        <div className="flex flex-col sm:flex-row h-full">
          {visual}
          {body}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {visual}
          {body}
        </div>
      )}
    </article>
  );

  if (store.website) {
    return (
      <a
        href={store.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Visitar el sitio web de ${store.name}`}
      >
        {article}
      </a>
    );
  }
  return article;
}

export function Stores() {
  const { content } = useContent();
  const stores = content.stores;
  const [active, setActive] = useState<string>("Todas");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const present = Array.from(new Set(stores.map((s) => s.category)));
    return ["Todas", ...present];
  }, [stores]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((s) => {
      const matchCat = active === "Todas" || s.category === active;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [stores, active, query]);

  return (
    <section id="tiendas" className="py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Directorio de tiendas"
          title="Tus marcas favoritas, todas en un solo lugar"
          description="Más de 150 marcas de moda, gastronomía, entretenimiento y tecnología. Filtra por categoría y empieza a recorrer."
          accent="red"
        />

        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={cn(
                "inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold transition-all duration-200",
                active === cat
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
          <div className="relative w-full sm:w-72 sm:ml-auto">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tiendas..."
              className="h-11 pl-10 bg-card border-border/70"
              aria-label="Buscar tiendas"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center py-16">
            <div className="mx-auto mb-4 grid place-items-center h-14 w-14 rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No encontramos tiendas para{" "}
              <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActive("Todas");
              }}
              className="mt-4 inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <StaggerGroup
            stagger={0.05}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filtered.map((store) => (
              <StaggerItem
                key={store.id}
                variant={fadeUp}
                className={cn("h-full", store.featured && "sm:col-span-2")}
              >
                <StoreCard store={store} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
