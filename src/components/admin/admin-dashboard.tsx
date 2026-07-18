"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Store as StoreIcon, Sparkles, Tag, CalendarDays, Image as ImageIcon,
  Film, HelpCircle, Settings, LogOut, X, ExternalLink, RefreshCw, Users,
  Menu as MenuIcon, ArrowLeft, BarChart3, History, Mail, FolderOpen, Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/stores/admin-store";
import { useToast } from "@/hooks/use-toast";
import {
  StoresEditor, ExperiencesEditor, PromosEditor, EventsEditor,
  GalleryEditor, MoviesEditor, FaqsEditor, SettingsEditor,
} from "./editors";
import { AnalyticsPanel } from "./analytics-panel";
import { ActivityPanel } from "./activity-panel";
import { SubscribersPanel } from "./subscribers-panel";
import { MessagesPanel } from "./messages-panel";
import { MediaLibrary } from "./media-library";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";

type Section =
  | "overview" | "analytics" | "stores" | "experiences" | "promos" | "events"
  | "gallery" | "movies" | "faqs" | "subscribers" | "messages" | "activity" | "media" | "settings";

const NAV: { id: Section; label: string; icon: any; group?: string }[] = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard, group: "Principal" },
  { id: "analytics", label: "Analíticas", icon: BarChart3, group: "Principal" },
  { id: "activity", label: "Actividad", icon: History, group: "Principal" },
  { id: "stores", label: "Tiendas", icon: StoreIcon, group: "Contenido" },
  { id: "experiences", label: "Experiencias", icon: Sparkles, group: "Contenido" },
  { id: "promos", label: "Promociones", icon: Tag, group: "Contenido" },
  { id: "events", label: "Eventos", icon: CalendarDays, group: "Contenido" },
  { id: "gallery", label: "Galería", icon: ImageIcon, group: "Contenido" },
  { id: "movies", label: "Cine", icon: Film, group: "Contenido" },
  { id: "faqs", label: "Preguntas FAQ", icon: HelpCircle, group: "Contenido" },
  { id: "media", label: "Biblioteca de medios", icon: FolderOpen, group: "Sistema" },
  { id: "subscribers", label: "Suscriptores", icon: Users, group: "Sistema" },
  { id: "messages", label: "Mensajes", icon: Mail, group: "Sistema" },
  { id: "settings", label: "Configuración", icon: Settings, group: "Sistema" },
];

export function AdminDashboard() {
  const { username, logout, closeAdmin } = useAdmin();
  const { toast } = useToast();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => { try { const res = await fetch("/api/admin/stats", { cache: "no-store" }); const data = await res.json(); if (!cancelled && data?.ok) setStats(data.stats); } catch {} })();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => { await logout(); toast({ title: "Sesión cerrada" }); };
  const nav = (s: Section) => { setSection(s); setSidebarOpen(false); };

  return (
    <div className="flex h-full w-full bg-muted/30 overflow-hidden">
      <CommandPalette onNavigate={(s) => nav(s as Section)} />
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-ink text-white">
        <SidebarContent section={section} nav={nav} stats={stats} username={username} onLogout={handleLogout} closeAdmin={closeAdmin} />
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-ink text-white flex flex-col lg:hidden">
              <SidebarContent section={section} nav={nav} stats={stats} username={username} onLogout={handleLogout} closeAdmin={closeAdmin} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><MenuIcon className="h-5 w-5" /></Button>
            <h2 className="font-display font-bold text-base sm:text-lg text-ink truncate">{NAV.find((n) => n.id === section)?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))} className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors" title="Buscar (Ctrl+K)">
              <Command className="h-3.5 w-3.5" /><span>Buscar</span><kbd className="ml-1 inline-flex items-center rounded border border-border bg-muted px-1 py-0.5 font-mono text-[0.6rem]">⌘K</kbd>
            </button>
            <Button variant="ghost" size="sm" onClick={() => { setStats(null); setRefreshKey((k) => k + 1); setTimeout(async () => { try { const res = await fetch("/api/admin/stats", { cache: "no-store" }); const data = await res.json(); if (data?.ok) setStats(data.stats); } catch {} }, 100); }} title="Recargar"><RefreshCw className="h-4 w-4" /><span className="hidden sm:inline ml-1.5">Recargar</span></Button>
            <Button variant="ghost" size="sm" onClick={closeAdmin} title="Ver sitio"><ExternalLink className="h-4 w-4" /><span className="hidden sm:inline ml-1.5">Ver sitio</span></Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive"><LogOut className="h-4 w-4" /><span className="hidden sm:inline ml-1.5">Salir</span></Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-fancy p-4 sm:p-6">
          <div key={section + refreshKey} className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {section === "overview" && <Overview stats={stats} nav={nav} />}
                {section === "analytics" && <AnalyticsPanel />}
                {section === "activity" && <ActivityPanel />}
                {section === "stores" && <StoresEditor />}
                {section === "experiences" && <ExperiencesEditor />}
                {section === "promos" && <PromosEditor />}
                {section === "events" && <EventsEditor />}
                {section === "gallery" && <GalleryEditor />}
                {section === "movies" && <MoviesEditor />}
                {section === "faqs" && <FaqsEditor />}
                {section === "media" && <MediaLibrary />}
                {section === "subscribers" && <SubscribersPanel />}
                {section === "messages" && <MessagesPanel />}
                {section === "settings" && <SettingsEditor />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ section, nav, stats, username, onLogout, closeAdmin, onClose }: {
  section: Section; nav: (s: Section) => void; stats: any; username: string | null;
  onLogout: () => void; closeAdmin: () => void; onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary text-primary-foreground font-display font-extrabold">V</span>
          <div className="leading-none"><div className="font-display font-extrabold text-sm">Ventura Admin</div><div className="text-[0.6rem] text-gold font-semibold uppercase tracking-wider mt-0.5">Panel</div></div>
        </div>
        {onClose && <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white" onClick={onClose}><X className="h-5 w-5" /></Button>}
      </div>
      <nav className="flex-1 overflow-y-auto scroll-fancy p-3 space-y-3">
        {Object.entries(NAV.reduce((acc, n) => { const g = n.group || "Otros"; if (!acc[g]) acc[g] = []; acc[g].push(n); return acc; }, {} as Record<string, typeof NAV>)).map(([group, items]) => (
          <div key={group}>
            <div className="px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/40">{group}</div>
            <div className="space-y-0.5">
              {items.map((n) => { const Icon = n.icon; const count = stats && n.id in stats ? stats[n.id] : null; return (
                <button key={n.id} onClick={() => nav(n.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", section === n.id ? "bg-primary text-primary-foreground shadow-md" : "text-white/70 hover:text-white hover:bg-white/8")}>
                  <Icon className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">{n.label}</span>
                  {count !== null && <span className={cn("text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full", section === n.id ? "bg-primary-foreground/20" : "bg-white/10")}>{count}</span>}
                </button>
              ); })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
        <div className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2">
          <div className="grid place-items-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold text-xs">{(username || "A").slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0"><div className="text-xs font-semibold text-white truncate">{username || "admin"}</div><div className="text-[0.6rem] text-white/50">Administrador</div></div>
        </div>
        <button onClick={closeAdmin} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-colors"><ArrowLeft className="h-3.5 w-3.5" />Volver al sitio</button>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-colors"><LogOut className="h-3.5 w-3.5" />Cerrar sesión</button>
      </div>
    </>
  );
}

function Overview({ stats, nav }: { stats: any; nav: (s: Section) => void }) {
  const cards = [
    { id: "stores" as Section, label: "Tiendas", icon: StoreIcon, value: stats?.stores ?? "—" },
    { id: "events" as Section, label: "Eventos", icon: CalendarDays, value: stats?.events ?? "—" },
    { id: "promos" as Section, label: "Promociones", icon: Tag, value: stats?.promos ?? "—" },
    { id: "movies" as Section, label: "Películas", icon: Film, value: stats?.movies ?? "—" },
    { id: "gallery" as Section, label: "Imágenes", icon: ImageIcon, value: stats?.gallery ?? "—" },
    { id: "experiences" as Section, label: "Experiencias", icon: Sparkles, value: stats?.experiences ?? "—" },
    { id: "faqs" as Section, label: "FAQ", icon: HelpCircle, value: stats?.faqs ?? "—" },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-ink to-ink/80 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Bienvenido al panel</h1>
          <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl">Gestiona todo el contenido del sitio de Ventura Mall. Los cambios se publican al instante en la página principal.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs"><Users className="h-3.5 w-3.5 text-gold" /><span className="font-semibold">{stats?.subscribers ?? 0}</span> suscriptores activos</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((c) => { const Icon = c.icon; return (
          <button key={c.id} onClick={() => nav(c.id)} className="group text-left rounded-2xl border border-border bg-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between"><span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Icon className="h-5 w-5" /></span></div>
            <div className="mt-3 font-display font-extrabold text-2xl text-ink">{c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </button>
        ); })}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-bold text-sm text-ink mb-3">Accesos rápidos</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => nav("analytics")}><BarChart3 className="h-4 w-4 mr-1.5" />Ver analíticas</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("stores")}><StoreIcon className="h-4 w-4 mr-1.5" />Administrar tiendas</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("events")}><CalendarDays className="h-4 w-4 mr-1.5" />Crear evento</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("gallery")}><ImageIcon className="h-4 w-4 mr-1.5" />Subir imágenes</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("subscribers")}><Users className="h-4 w-4 mr-1.5" />Suscriptores</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("messages")}><Mail className="h-4 w-4 mr-1.5" />Mensajes</Button>
          <Button size="sm" variant="secondary" onClick={() => nav("settings")}><Settings className="h-4 w-4 mr-1.5" />Configuración</Button>
        </div>
      </div>
    </div>
  );
}
