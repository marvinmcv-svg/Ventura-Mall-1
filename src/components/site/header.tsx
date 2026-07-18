"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useContent } from "@/lib/content-context";
import { useAdmin } from "@/stores/admin-store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Tiendas", href: "#tiendas" }, { label: "Experiencias", href: "#experiencias" },
  { label: "Gastronomía", href: "#gastronomia" }, { label: "Cine", href: "#cine" },
  { label: "Eventos", href: "#eventos" }, { label: "Promociones", href: "#promociones" }, { label: "Visita", href: "#visita" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { content } = useContent();
  const phone = content.settings.phone || "+591 3 3432121";
  const { open: adminOpen } = useAdmin();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // During SSR and first client render, use false for both scrolled and adminOpen
  const effectiveScrolled = mounted ? scrolled : false;
  const effectiveAdminOpen = mounted ? adminOpen : false;

  return (
    <header className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-300", effectiveScrolled ? "bg-background/95 backdrop-blur-md shadow-[0_4px_24px_-12px_oklch(0.21_0.012_50/0.4)] border-b border-border/60" : "bg-transparent", effectiveAdminOpen && "z-30")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          <Link href="#inicio" className="flex items-center gap-2.5 group">
            <span className={cn("relative grid place-items-center h-10 w-10 rounded-xl font-display font-extrabold text-xl shadow-lg transition-transform group-hover:scale-105", effectiveScrolled ? "bg-primary text-primary-foreground" : "bg-white text-primary")}>V</span>
            <span className="flex flex-col leading-none">
              <span className={cn("font-display font-extrabold text-lg sm:text-xl tracking-tight transition-colors", effectiveScrolled ? "text-foreground" : "text-white drop-shadow")}>Ventura</span>
              <span className={cn("text-[0.6rem] sm:text-xs font-semibold uppercase tracking-[0.22em] transition-colors", effectiveScrolled ? "text-primary" : "text-white/90 drop-shadow")}>Mall · Santa Cruz</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn("px-3.5 py-2 rounded-lg text-sm font-medium transition-colors", effectiveScrolled ? "text-foreground/80 hover:text-primary hover:bg-primary/5" : "text-white/90 hover:text-white hover:bg-white/10")}>{link.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className={cn("hidden md:inline-flex items-center gap-1.5 text-sm font-medium transition-colors", effectiveScrolled ? "text-foreground/70 hover:text-primary" : "text-white/90 hover:text-white")}><Phone className="h-4 w-4" />{phone}</a>
            <Button asChild size="sm" className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"><Link href="#visita"><MapPin className="h-4 w-4 mr-1.5" />Cómo llegar</Link></Button>
            {mounted && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className={cn("lg:hidden", effectiveScrolled ? "text-foreground" : "text-white hover:bg-white/10")} aria-label="Abrir menú"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                      <div className="flex items-center gap-2"><span className="grid place-items-center h-9 w-9 rounded-lg bg-primary text-primary-foreground font-display font-extrabold">V</span><span className="font-display font-extrabold text-lg">Ventura Mall</span></div>
                      <SheetClose asChild><Button variant="ghost" size="icon" aria-label="Cerrar"><X className="h-5 w-5" /></Button></SheetClose>
                    </div>
                    <nav className="flex-1 overflow-y-auto scroll-fancy px-3 py-4">
                      {navLinks.map((link) => (<SheetClose asChild key={link.href}><Link href={link.href} className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"><ShoppingBag className="h-4 w-4 text-primary" />{link.label}</Link></SheetClose>))}
                    </nav>
                    <div className="border-t border-border p-4 space-y-2">
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><Link href="#visita"><MapPin className="h-4 w-4 mr-2" />Cómo llegar</Link></Button>
                      <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" />{phone}</a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
