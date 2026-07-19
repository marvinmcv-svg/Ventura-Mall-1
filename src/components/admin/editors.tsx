"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Store as StoreIcon, Sparkles, Tag, CalendarDays, Image as ImageIcon, Film, HelpCircle, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MediaPicker } from "./media-picker";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function useEntityList<T extends { id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => { setLoading(true); try { const res = await fetch(endpoint, { cache: "no-store" }); const data = await res.json(); if (data?.ok) setItems(data.items as T[]); } catch {} finally { setLoading(false); } }, [endpoint]);
  useEffect(() => { reload(); }, [reload]);
  const create = async (body: any) => { const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await res.json(); if (data?.ok) { await reload(); return data.item; } throw new Error(data?.error || "Error"); };
  const update = async (id: string, body: any) => { const res = await fetch(`${endpoint}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await res.json(); if (data?.ok) { await reload(); return data.item; } throw new Error(data?.error); };
  const remove = async (id: string) => { const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" }); const data = await res.json(); if (!data?.ok) throw new Error(data?.error); await reload(); };
  return { items, loading, reload, create, update, remove };
}

function FormShell({ title, onClose, children, onSave, saving }: { title: string; onClose: () => void; children: React.ReactNode; onSave: () => void; saving: boolean; }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm flex items-stretch justify-center p-0 sm:p-6" onClick={onClose}>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 280 }} onClick={(e) => e.stopPropagation()} className="bg-background w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0"><h3 className="font-display font-bold text-lg text-ink">{title}</h3><Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5" /></Button></div>
        <div className="flex-1 overflow-y-auto scroll-fancy px-5 py-5">{children}</div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 shrink-0"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Guardar</Button></div>
      </motion.div>
    </motion.div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><Label className="text-xs font-semibold text-foreground mb-1.5 block">{label}</Label>{children}</div>; }
function EmptyState({ icon: Icon, label }: { icon: any; label: string }) { return <div className="text-center py-12"><div className="mx-auto mb-3 grid place-items-center h-14 w-14 rounded-full bg-muted"><Icon className="h-6 w-6 text-muted-foreground" /></div><p className="text-sm text-muted-foreground">{label}</p></div>; }

const STORE_CATEGORIES = ["Moda", "Gastronomía", "Entretenimiento", "Hogar", "Servicios", "Tecnología"];
const STORE_COLORS = ["bg-ink","bg-zinc-800","bg-slate-900","bg-red-700","bg-red-600","bg-rose-500","bg-pink-600","bg-fuchsia-500","bg-purple-600","bg-amber-700","bg-orange-600","bg-orange-500","bg-yellow-500","bg-lime-600","bg-green-700","bg-emerald-800","bg-teal-600","bg-blue-900","bg-gold"];

export function StoresEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/stores");
  const { toast } = useToast();
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = items.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()));
  const onSave = async () => { if (!editing) return; setSaving(true); try { if (editing.id) await update(editing.id, editing); else await create(editing); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." className="pl-9 h-9" /></div>
        <Button onClick={() => setEditing({ name: "", category: "Moda", level: "Nivel 1", description: "", color: "bg-ink", textOn: "light", featured: false, order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva tienda</Button>
      </div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : filtered.length === 0 ? <EmptyState icon={StoreIcon} label="No hay tiendas." /> : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className={cn("grid place-items-center h-12 w-12 rounded-lg shrink-0 font-display font-extrabold", s.color, s.textOn === "light" ? "text-white" : "text-ink")}>{s.name.slice(0, 2).toUpperCase()}</div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold text-sm text-ink truncate">{s.name}</span>{s.featured && <Star className="h-3.5 w-3.5 text-gold fill-gold shrink-0" />}{!s.active && <Badge variant="secondary" className="text-[0.6rem]">Inactiva</Badge>}</div><div className="text-xs text-muted-foreground truncate">{s.category} · {s.level}</div></div>
              <div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(s)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(s.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3.5 w-3.5" /></Button></div>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>{editing && (
        <FormShell title={editing.id ? "Editar tienda" : "Nueva tienda"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4"><Field label="Nombre"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field><Field label="Categoría"><select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{STORE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field><Field label="Nivel / Ubicación"><Input value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })} /></Field><Field label="Orden"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field></div>
            <Field label="Descripción"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></Field>
            <div className="grid sm:grid-cols-2 gap-4"><Field label="Color del tile"><div className="flex flex-wrap gap-1.5">{STORE_COLORS.map((c) => <button key={c} type="button" onClick={() => setEditing({ ...editing, color: c })} className={cn("h-7 w-7 rounded-md border-2", c, editing.color === c ? "border-primary ring-2 ring-primary/30" : "border-border")} />)}</div></Field><Field label="Color de texto"><div className="flex gap-2">{(["light", "dark"] as const).map((t) => <button key={t} type="button" onClick={() => setEditing({ ...editing, textOn: t })} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border", editing.textOn === t ? "bg-primary text-primary-foreground border-primary" : "border-border")}>{t === "light" ? "Claro" : "Oscuro"}</button>)}</div></Field></div>
            <div className="grid sm:grid-cols-2 gap-4"><Field label="Teléfono (opcional)"><Input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field><Field label="Sitio web (opcional)"><Input value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></Field></div>
            <MediaPicker label="Logo (opcional)" value={editing.logoUrl || ""} onChange={(v) => setEditing({ ...editing, logoUrl: v })} />
            <div className="flex items-center gap-6"><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />Destacada</label><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div>
          </div>
        </FormShell>
      )}</AnimatePresence>
    </div>
  );
}

export function ExperiencesEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/experiences");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false); const [highlightsInput, setHighlightsInput] = useState("");
  useEffect(() => { if (editing) { try { setHighlightsInput((JSON.parse(editing.highlights || "[]") as string[]).join("\n")); } catch { setHighlightsInput(""); } } }, [editing]);
  const onSave = async () => { if (!editing) return; setSaving(true); try { const highlights = highlightsInput.split("\n").map((s) => s.trim()).filter(Boolean); const body = { ...editing, highlights }; if (editing.id) await update(editing.id, body); else await create(body); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ title: "", subtitle: "", description: "", image: "", badge: "", accent: "coral", order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva experiencia</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={Sparkles} label="Sin experiencias." /> : (
        <div className="grid sm:grid-cols-2 gap-3">{items.map((e) => (<div key={e.id} className="rounded-xl border border-border bg-card overflow-hidden flex"><div className="w-24 shrink-0 bg-muted"><img src={e.image} alt="" className="h-full w-full object-cover" /></div><div className="flex-1 p-3 min-w-0"><div className="font-semibold text-sm text-ink truncate">{e.title}</div><div className="text-xs text-muted-foreground truncate">{e.subtitle}</div><div className="mt-2 flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(e)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(e.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3.5 w-3.5" /></Button></div></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar experiencia" : "Nueva experiencia"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><Field label="Título"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Subtítulo"><Input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></Field></div><Field label="Descripción"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></Field><MediaPicker label="Imagen" value={editing.image || ""} onChange={(v) => setEditing({ ...editing, image: v })} /><div className="grid sm:grid-cols-3 gap-4"><Field label="Etiqueta"><Input value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} /></Field><Field label="Acento"><select value={editing.accent} onChange={(e) => setEditing({ ...editing, accent: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["coral", "gold", "emerald", "ink"].map((c) => <option key={c} value={c}>{c}</option>)}</select></Field><Field label="Orden"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field></div><Field label="Highlights (uno por línea)"><Textarea value={highlightsInput} onChange={(e) => setHighlightsInput(e.target.value)} rows={4} /></Field><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

export function PromosEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/promos");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false);
  const onSave = async () => { if (!editing) return; setSaving(true); try { if (editing.id) await update(editing.id, editing); else await create(editing); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ title: "", description: "", category: "Moda", date: "", accent: "coral", emoji: "✨", image: "", order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva promoción</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={Tag} label="Sin promociones." /> : (
        <div className="grid sm:grid-cols-2 gap-3">{items.map((p) => (<div key={p.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"><div className="text-2xl">{p.emoji}</div><div className="flex-1 min-w-0"><div className="font-semibold text-sm text-ink">{p.title}</div><div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div><div className="text-[0.7rem] text-muted-foreground mt-1">{p.category} · {p.date}</div></div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(p)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(p.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar promoción" : "Nueva promoción"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><div className="grid sm:grid-cols-[80px_1fr] gap-4"><Field label="Emoji"><Input value={editing.emoji} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} className="text-center text-xl" /></Field><Field label="Título"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div><Field label="Descripción"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></Field><MediaPicker label="Imagen (opcional)" value={editing.image || ""} onChange={(v) => setEditing({ ...editing, image: v })} /><div className="grid sm:grid-cols-3 gap-4"><Field label="Categoría"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field><Field label="Fecha / vigencia"><Input value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field><Field label="Acento"><select value={editing.accent} onChange={(e) => setEditing({ ...editing, accent: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["coral", "gold", "emerald", "ink"].map((c) => <option key={c} value={c}>{c}</option>)}</select></Field></div><Field label="Orden"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

export function EventsEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/events");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false);
  const onSave = async () => { if (!editing) return; setSaving(true); try { if (editing.id) await update(editing.id, editing); else await create(editing); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" }) : "";
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ title: "", description: "", category: "General", date: new Date().toISOString().slice(0,16), endDate: "", location: "", image: "", accent: "coral", featured: false, order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nuevo evento</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={CalendarDays} label="Sin eventos." /> : (
        <div className="space-y-2">{items.map((ev) => (<div key={ev.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"><div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">{ev.image && <img src={ev.image} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold text-sm text-ink truncate">{ev.title}</span>{ev.featured && <Star className="h-3 w-3 text-gold fill-gold" />}</div><div className="text-xs text-muted-foreground">{ev.category} · {fmt(ev.date)}{ev.location ? ` · ${ev.location}` : ""}</div></div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing({ ...ev, date: ev.date ? new Date(ev.date).toISOString().slice(0,16) : "", endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0,16) : "" })}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(ev.id).then(() => toast({ title: "Eliminado" })); }}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar evento" : "Nuevo evento"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><Field label="Título"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Descripción"><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></Field><MediaPicker label="Imagen" value={editing.image || ""} onChange={(v) => setEditing({ ...editing, image: v })} /><div className="grid sm:grid-cols-2 gap-4"><Field label="Fecha y hora de inicio"><Input type="datetime-local" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field><Field label="Fecha y hora de fin (opcional)"><Input type="datetime-local" value={editing.endDate || ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></Field></div><div className="grid sm:grid-cols-3 gap-4"><Field label="Categoría"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field><Field label="Ubicación"><Input value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field><Field label="Acento"><select value={editing.accent} onChange={(e) => setEditing({ ...editing, accent: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["coral", "gold", "emerald", "ink"].map((c) => <option key={c} value={c}>{c}</option>)}</select></Field></div><div className="flex items-center gap-6"><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />Destacado</label><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activo</label></div></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

export function GalleryEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/gallery");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false);
  const onSave = async () => { if (!editing) return; setSaving(true); try { if (editing.id) await update(editing.id, editing); else await create(editing); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ title: "", image: "", caption: "", category: "General", order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva imagen</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={ImageIcon} label="Galería vacía." /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{items.map((g) => (<div key={g.id} className="group relative rounded-xl overflow-hidden border border-border bg-card"><div className="aspect-square bg-muted"><img src={g.image} alt={g.title} className="h-full w-full object-cover" /></div><div className="p-2"><div className="text-xs font-semibold text-ink truncate">{g.title}</div><div className="text-[0.65rem] text-muted-foreground truncate">{g.category}</div></div><div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="secondary" size="icon" className="h-7 w-7 bg-white/90" onClick={() => setEditing(g)}><Pencil className="h-3 w-3" /></Button><Button variant="secondary" size="icon" className="h-7 w-7 bg-white/90 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(g.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3 w-3" /></Button></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar imagen" : "Nueva imagen"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><Field label="Título"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><MediaPicker label="Imagen" value={editing.image || ""} onChange={(v) => setEditing({ ...editing, image: v })} accept="image/*,video/*" /><Field label="Descripción (caption)"><Input value={editing.caption || ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} /></Field><div className="grid sm:grid-cols-2 gap-4"><Field label="Categoría"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field><Field label="Orden"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field></div><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

export function MoviesEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/movies");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false); const [showtimesInput, setShowtimesInput] = useState("");
  useEffect(() => { if (editing) { try { setShowtimesInput((JSON.parse(editing.showtimes || "[]") as string[]).join(", ")); } catch { setShowtimesInput(""); } } }, [editing]);
  const onSave = async () => { if (!editing) return; setSaving(true); try { const showtimes = showtimesInput.split(",").map((s) => s.trim()).filter(Boolean); const body = { ...editing, showtimes }; if (editing.id) await update(editing.id, body); else await create(body); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ title: "", format: "2D", genre: "", duration: 120, rating: "", poster: "", synopsis: "", ticketUrl: "", featured: false, order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva película</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={Film} label="Sin películas." /> : (
        <div className="grid sm:grid-cols-2 gap-3">{items.map((m) => (<div key={m.id} className="flex gap-3 rounded-xl border border-border bg-card p-3"><div className="w-14 h-20 rounded-md overflow-hidden bg-muted shrink-0">{m.poster && <img src={m.poster} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold text-sm text-ink truncate">{m.title}</span>{m.featured && <Star className="h-3 w-3 text-gold fill-gold" />}</div><div className="text-xs text-muted-foreground">{m.format} · {m.genre} · {m.duration}min</div><div className="mt-1 flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(m)}><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(m.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3 w-3" /></Button></div></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar película" : "Nueva película"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><Field label="Título"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Formato"><select value={editing.format} onChange={(e) => setEditing({ ...editing, format: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["2D", "3D", "IMAX", "DUB", "XD", "DBOX"].map((f) => <option key={f} value={f}>{f}</option>)}</select></Field></div><div className="grid sm:grid-cols-3 gap-4"><Field label="Género"><Input value={editing.genre || ""} onChange={(e) => setEditing({ ...editing, genre: e.target.value })} /></Field><Field label="Duración (min)"><Input type="number" value={editing.duration || 0} onChange={(e) => setEditing({ ...editing, duration: Number(e.target.value) })} /></Field><Field label="Clasificación"><Input value={editing.rating || ""} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} placeholder="PG-13" /></Field></div><MediaPicker label="Póster" value={editing.poster || ""} onChange={(v) => setEditing({ ...editing, poster: v })} /><Field label="Sinopsis"><Textarea value={editing.synopsis || ""} onChange={(e) => setEditing({ ...editing, synopsis: e.target.value })} rows={3} /></Field><Field label="Horarios (separados por coma)"><Input value={showtimesInput} onChange={(e) => setShowtimesInput(e.target.value)} /></Field><Field label="URL de entradas"><Input value={editing.ticketUrl || ""} onChange={(e) => setEditing({ ...editing, ticketUrl: e.target.value })} /></Field><div className="flex items-center gap-6"><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />Destacada</label><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

export function FaqsEditor() {
  const { items, loading, create, update, remove } = useEntityList<any>("/api/admin/faqs");
  const { toast } = useToast(); const [editing, setEditing] = useState<any | null>(null); const [saving, setSaving] = useState(false);
  const onSave = async () => { if (!editing) return; setSaving(true); try { if (editing.id) await update(editing.id, editing); else await create(editing); toast({ title: "Guardado" }); setEditing(null); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({ question: "", answer: "", category: "General", order: 0, active: true })} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Nueva pregunta</Button></div>
      {loading ? <EmptyState icon={Loader2} label="Cargando..." /> : items.length === 0 ? <EmptyState icon={HelpCircle} label="Sin preguntas." /> : (
        <div className="space-y-2">{items.map((f) => (<div key={f.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"><div className="flex-1 min-w-0"><div className="font-semibold text-sm text-ink">{f.question}</div><div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{f.answer}</div><div className="text-[0.7rem] text-muted-foreground mt-1">{f.category}</div></div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(f)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("¿Eliminar?")) remove(f.id).then(() => toast({ title: "Eliminada" })); }}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>))}</div>
      )}
      <AnimatePresence>{editing && (<FormShell title={editing.id ? "Editar pregunta" : "Nueva pregunta"} onClose={() => setEditing(null)} onSave={onSave} saving={saving}><div className="space-y-4"><Field label="Pregunta"><Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></Field><Field label="Respuesta"><Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={5} /></Field><div className="grid sm:grid-cols-2 gap-4"><Field label="Categoría"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field><Field label="Orden"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field></div><label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Activa</label></div></FormShell>)}</AnimatePresence>
    </div>
  );
}

const SETTING_FIELDS: { key: string; label: string; type?: "text" | "textarea" }[] = [
  { key: "siteName", label: "Nombre del sitio" }, { key: "tagline", label: "Eslogan" },
  { key: "heroEyebrow", label: "Hero — texto superior" }, { key: "heroTitle", label: "Hero — título" },
  { key: "heroSubtitle", label: "Hero — subtítulo", type: "textarea" },
  { key: "aboutText", label: "Texto 'Acerca de'", type: "textarea" }, { key: "address", label: "Dirección" },
  { key: "city", label: "Ciudad / País" }, { key: "phone", label: "Teléfono" }, { key: "email", label: "Email" },
  { key: "lat", label: "Latitud" }, { key: "lng", label: "Longitud" }, { key: "inaugurated", label: "Inauguración" },
  { key: "investment", label: "Inversión" }, { key: "area", label: "Área construida" }, { key: "architect", label: "Arquitecto" },
  { key: "floors", label: "Plantas" }, { key: "instagram", label: "Instagram URL" }, { key: "facebook", label: "Facebook URL" },
  { key: "twitter", label: "Twitter URL" }, { key: "foursquare", label: "Foursquare URL" },
];
export function SettingsEditor() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  useEffect(() => { (async () => { try { const res = await fetch("/api/admin/settings", { cache: "no-store" }); const data = await res.json(); if (data?.ok) setSettings(data.settings || {}); } catch {} finally { setLoading(false); } })(); }, []);
  const save = async () => { setSaving(true); try { const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings }) }); const data = await res.json(); if (data?.ok) toast({ title: "Configuración guardada", description: `${data.updated} campos actualizados` }); else throw new Error(data?.error); } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setSaving(false); } };
  if (loading) return <EmptyState icon={Loader2} label="Cargando..." />;
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">{SETTING_FIELDS.map((f) => <Field key={f.key} label={f.label}>{f.type === "textarea" ? <Textarea value={settings[f.key] || ""} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} rows={3} /> : <Input value={settings[f.key] || ""} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} />}</Field>)}</div>
      <Field label="Hero — imagen"><MediaPicker label="" value={settings.heroImage || ""} onChange={(v) => setSettings({ ...settings, heroImage: v })} /></Field>
      <div className="sticky bottom-0 -mx-5 px-5 py-3 bg-background border-t border-border flex justify-end"><Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Guardar configuración</Button></div>
    </div>
  );
}
