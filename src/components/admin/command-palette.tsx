"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Store, Sparkles, Tag, CalendarDays, Image as ImageIcon, Film, HelpCircle, Settings, LayoutDashboard, Users, Mail, History, BarChart3, ArrowRight, CornerDownLeft, FolderOpen } from "lucide-react";
import { useAdmin } from "@/stores/admin-store";
interface CommandPaletteProps { onNavigate: (section: string) => void; }
export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const { open } = useAdmin();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const commands = useMemo(() => { const nav = (s: string) => () => { onNavigate(s); setPaletteOpen(false); setQuery(""); }; return [
    { id: "overview", label: "Ir a Resumen", category: "Navegación", icon: LayoutDashboard, action: nav("overview") },
    { id: "analytics", label: "Ver Analíticas", category: "Navegación", icon: BarChart3, action: nav("analytics") },
    { id: "activity", label: "Registro de Actividad", category: "Navegación", icon: History, action: nav("activity") },
    { id: "stores", label: "Administrar Tiendas", category: "Contenido", icon: Store, action: nav("stores") },
    { id: "experiences", label: "Administrar Experiencias", category: "Contenido", icon: Sparkles, action: nav("experiences") },
    { id: "promos", label: "Administrar Promociones", category: "Contenido", icon: Tag, action: nav("promos") },
    { id: "events", label: "Administrar Eventos", category: "Contenido", icon: CalendarDays, action: nav("events") },
    { id: "gallery", label: "Administrar Galería", category: "Contenido", icon: ImageIcon, action: nav("gallery") },
    { id: "movies", label: "Administrar Cine", category: "Contenido", icon: Film, action: nav("movies") },
    { id: "faqs", label: "Administrar FAQ", category: "Contenido", icon: HelpCircle, action: nav("faqs") },
    { id: "settings", label: "Configuración del sitio", category: "Sistema", icon: Settings, action: nav("settings") },
    { id: "media", label: "Biblioteca de medios", category: "Sistema", icon: FolderOpen, action: nav("media") },
    { id: "subscribers", label: "Suscriptores", category: "Sistema", icon: Users, action: nav("subscribers") },
    { id: "messages", label: "Mensajes de contacto", category: "Sistema", icon: Mail, action: nav("messages") },
  ]; }, [onNavigate]);
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen((v) => !v); } if (e.key === "Escape") setPaletteOpen(false); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [open]);
  const filtered = useMemo(() => { if (!query.trim()) return commands; const q = query.toLowerCase(); return commands.filter((c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)); }, [query, commands]);
  const grouped = useMemo(() => { const g: Record<string, typeof commands> = {}; for (const c of filtered) { if (!g[c.category]) g[c.category] = []; g[c.category].push(c); } return g; }, [filtered]);
  return (
    <AnimatePresence>{paletteOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4" onClick={() => setPaletteOpen(false)}>
        <motion.div initial={{ scale: 0.95, y: -10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -10 }} transition={{ type: "spring", damping: 26, stiffness: 320 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b border-border"><Search className="h-5 w-5 text-muted-foreground shrink-0" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar acciones o ir a..." className="flex-1 h-14 bg-transparent outline-none text-foreground placeholder:text-muted-foreground" /><kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.65rem] font-mono text-muted-foreground">ESC</kbd></div>
          <div className="max-h-[50vh] overflow-y-auto scroll-fancy p-2">{Object.keys(grouped).length === 0 ? <div className="text-center py-8 text-sm text-muted-foreground">No se encontraron resultados para "{query}".</div> : Object.entries(grouped).map(([cat, items]) => (<div key={cat} className="mb-2"><div className="px-2 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">{cat}</div>{items.map((cmd) => { const Icon = cmd.icon; return (<button key={cmd.id} onClick={cmd.action} className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors group"><Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" /><span className="flex-1 text-left">{cmd.label}</span><ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /></button>); })}</div>))}</div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 text-[0.7rem] text-muted-foreground"><div className="flex items-center gap-3"><span className="flex items-center gap-1"><kbd className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono">↑↓</kbd>navegar</span><span className="flex items-center gap-1"><kbd className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono"><CornerDownLeft className="h-2.5 w-2.5" /></kbd>seleccionar</span></div><span>Cmd + K</span></div>
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
}
