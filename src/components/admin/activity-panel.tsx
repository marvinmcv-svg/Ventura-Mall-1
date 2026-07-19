"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogIn, LogOut, Upload, RefreshCw, History } from "lucide-react";
import { cn } from "@/lib/utils";
const actionConfig: Record<string, { icon: any; color: string; label: string }> = { create: { icon: Plus, color: "text-emerald bg-emerald/12", label: "Creó" }, update: { icon: Pencil, color: "text-primary bg-primary/10", label: "Actualizó" }, delete: { icon: Trash2, color: "text-destructive bg-destructive/10", label: "Eliminó" }, login: { icon: LogIn, color: "text-emerald bg-emerald/12", label: "Inició sesión" }, logout: { icon: LogOut, color: "text-muted-foreground bg-muted", label: "Cerró sesión" }, upload: { icon: Upload, color: "text-[#7a4d00] bg-gold/15", label: "Subió archivo" }, bulk: { icon: RefreshCw, color: "text-primary bg-primary/10", label: "Acción masiva" } };
const entityLabels: Record<string, string> = { store: "tienda", experience: "experiencia", promo: "promoción", event: "evento", gallery: "imagen", movie: "película", faq: "FAQ", settings: "configuración", subscriber: "suscriptor", auth: "sesión", message: "mensaje" };
function timeAgo(iso: string) { const diff = Date.now() - new Date(iso).getTime(); const min = Math.floor(diff / 60000); if (min < 1) return "ahora"; if (min < 60) return `hace ${min} min`; const hr = Math.floor(min / 60); if (hr < 24) return `hace ${hr}h`; const days = Math.floor(hr / 24); if (days < 7) return `hace ${days}d`; return new Date(iso).toLocaleDateString("es-BO", { day: "2-digit", month: "short" }); }
export function ActivityPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const load = async () => { setLoading(true); try { const res = await fetch(`/api/admin/activity?limit=100${filter !== "all" ? `&entity=${filter}` : ""}`, { cache: "no-store" }); const data = await res.json(); if (data?.ok) setItems(data.items); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, [filter]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">{["all", "store", "experience", "event", "promo", "gallery", "movie", "faq", "subscriber", "message", "settings", "media", "auth"].map((f) => <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border", filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground")}>{f === "all" ? "Todo" : entityLabels[f] || f}</button>)}</div>
        <button onClick={load} className="grid place-items-center h-9 w-9 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground" aria-label="Recargar"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></button>
      </div>
      {loading ? <div className="grid place-items-center py-12"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div> : items.length === 0 ? <div className="text-center py-12"><History className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" /><p className="text-sm text-muted-foreground">No hay actividad registrada.</p></div> : (
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto scroll-fancy pr-1">{items.map((item, i) => { const cfg = actionConfig[item.action] || actionConfig.update; const Icon = cfg.icon; return (<motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:shadow-sm transition-shadow"><span className={cn("grid place-items-center h-9 w-9 rounded-lg shrink-0", cfg.color)}><Icon className="h-4 w-4" /></span><div className="flex-1 min-w-0"><div className="text-sm text-ink"><span className="font-semibold">{item.username}</span> <span className="text-muted-foreground">{cfg.label.toLowerCase()}</span> <span className="font-medium">{item.entityName || entityLabels[item.entity] || item.entity}</span></div><div className="text-[0.7rem] text-muted-foreground mt-0.5">{entityLabels[item.entity] || item.entity}{item.details && <span className="ml-1.5 opacity-70">· {item.details.slice(0, 80)}</span>}</div></div><span className="text-[0.7rem] text-muted-foreground shrink-0 tabular-nums">{timeAgo(item.createdAt)}</span></motion.div>); })}</div>
      )}
    </div>
  );
}
