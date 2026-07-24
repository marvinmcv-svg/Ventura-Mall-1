"use client";

import { useMemo, useState, useCallback } from "react";
import { ArrowUpRight, MapPin, Search, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
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

/** Lightbox gallery for a store's images. */
function StoreLightbox({
  store,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  store: StoreItem;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const images = store.images;
  const current = images[index];
  if (!current) return null;
  return (
    <div
      className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${store.name}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Cerrar galería"
      >
        <X className="h-5 w-5" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 sm:left-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 sm:right-4 grid place-items-center h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={current}
          alt={`${store.name} — imagen ${index + 1} de ${images.length}`}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
        <div className="mt-4 text-center text-white/80">
          <div className="font-display font-bold text-lg">{store.name}</div>
          <div className="text-xs text-white/50 mt-1">
            {index + 1} / {images.length}
            {store.level && <span className="ml-2">· {store.level}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, onOpenGallery }: { store: StoreItem; onOpenGallery: (store: StoreItem) => void }) {
  const textCol = store.textOn === "light" ? "text-white" : "text-ink";
  const isFeatured = store.featured;
  const hasImages = store.images.length > 0;
  const heroImage = hasImages ? store.images[0] : store.logoUrl;

  const visual = (
    <div
      className={cn(
        "relative overflow-hidden grid place-items-center",
        isFeatured ? "h-32 sm:h-auto sm:w-2/5 shrink-0" : "h-20",
        !heroImage && store.color,
        !heroImage && textCol
      )}
    >
      {heroImage ? (
        <img
          src={heroImage}
          alt={store.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      {hasImages && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink/70 backdrop-blur-sm px-2.5 py-1 text-[0.65rem] font-semibold text-white">
          <Images className="h-3 w-3" />
          {store.images.length}
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
        <div className="flex items-center gap-3">
          {hasImages && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-1.5">
              Ver galería
              <Images className="h-3.5 w-3.5" />
            </span>
          )}
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/70 hover:text-primary transition-colors"
              aria-label={`Visitar sitio web de ${store.name}`}
            >
              Web
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  // If the store has images, the whole card is a button that opens the lightbox.
  // If no images but has a website, the whole card links to the website (original behavior).
  if (hasImages) {
    return (
      <button
        type="button"
        onClick={() => onOpenGallery(store)}
        className="group block text-left w-full h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Ver galería de imágenes de ${store.name}`}
      >
        <article className="relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 hover:border-border">
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
      </button>
    );
  }

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
  const { settings } = content;
  const [active, setActive] = useState<string>("Todas");
  const [query, setQuery] = useState("");
  const [galleryStore, setGalleryStore] = useState<StoreItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  const openGallery = useCallback((store: StoreItem) => {
    setGalleryStore(store);
    setGalleryIndex(0);
  }, []);
  const closeGallery = useCallback(() => setGalleryStore(null), []);
  const prevImage = useCallback(() => {
    setGalleryIndex((i) => (galleryStore ? (i - 1 + galleryStore.images.length) % galleryStore.images.length : 0));
  }, [galleryStore]);
  const nextImage = useCallback(() => {
    setGalleryIndex((i) => (galleryStore ? (i + 1) % galleryStore.images.length : 0));
  }, [galleryStore]);

  return (
    <section id="tiendas" className="py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={settings.storesEyebrow || "Directorio de tiendas"}
          title={settings.storesTitle || "Tus marcas favoritas, todas en un solo lugar"}
          description={settings.storesDescription || "Más de 150 marcas de moda, gastronomía, entretenimiento y tecnología. Filtra por categoría y empezá a recorrer."}
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
                <StoreCard store={store} onOpenGallery={openGallery} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>

      {galleryStore && (
        <StoreLightbox
          store={galleryStore}
          index={galleryIndex}
          onClose={closeGallery}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}
