"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Download, Trash2, RefreshCw, Mail, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
export function SubscribersPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const load = async () => { setLoading(true); try { const res = await fetch("/api/admin/subscribers", { cache: "no-store" }); const data = await res.json(); if (data?.ok) setItems(data.items); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const exportCsv = () => { window.open("/api/admin/subscribers?format=csv", "_blank"); toast({ title: "Exportando CSV..." }); };
  const toggle = async (id: string, active: boolean) => { try { await fetch(`/api/admin/subscribers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) }); toast({ title: active ? "Desactivado" : "Activado" }); load(); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } };
  const remove = async (id: string) => { if (!confirm("¿Eliminar este suscriptor?")) return; try { await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" }); toast({ title: "Eliminado" }); load(); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } };
  const active = items.filter((s) => s.active).length;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4"><div className="text-sm text-muted-foreground"><span className="font-bold text-ink">{items.length}</span> total · <span className="font-bold text-emerald">{active}</span> activos</div><div className="flex gap-2"><Button variant="secondary" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1.5" />Exportar CSV</Button><Button variant="ghost" size="icon" onClick={load} className="h-9 w-9"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button></div></div>
      {loading ? <div className="grid place-items-center py-12"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div> : items.length === 0 ? <div className="text-center py-12"><Users className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" /><p className="text-sm text-muted-foreground">No hay suscriptores aún.</p></div> : (
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto scroll-fancy pr-1">{items.map((s, i) => (<motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"><div className="grid place-items-center h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">{s.email.slice(0, 2).toUpperCase()}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="text-sm font-medium text-ink truncate">{s.name || s.email}</span>{!s.active && <Badge variant="secondary" className="text-[0.6rem]">Inactivo</Badge>}</div><div className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</div></div><div className="text-[0.7rem] text-muted-foreground shrink-0 hidden sm:block">{new Date(s.createdAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}</div><div className="flex gap-1 shrink-0"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggle(s.id, s.active)} title={s.active ? "Desactivar" : "Activar"}>{s.active ? <Check className="h-3.5 w-3.5 text-emerald" /> : <X className="h-3.5 w-3.5 text-muted-foreground" />}</Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button></div></motion.div>))}</div>
      )}
    </div>
  );
}
