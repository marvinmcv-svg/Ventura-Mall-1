"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Film, RefreshCw, Copy, Check, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
export function MediaLibrary() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const load = async () => { setLoading(true); try { const res = await fetch("/api/admin/media", { cache: "no-store" }); const data = await res.json(); if (data?.ok) setFiles(data.files || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const doUpload = async (file: File) => { setUploading(true); try { const fd = new FormData(); fd.append("file", file); const res = await fetch("/api/admin/upload", { method: "POST", body: fd }); const d = await res.json(); if (d?.ok) { toast({ title: "Archivo subido", description: file.name }); load(); } else { toast({ variant: "destructive", title: "Error al subir", description: d?.error || "Error" }); } } catch (e: any) { toast({ variant: "destructive", title: "Error de red", description: e.message }); } finally { setUploading(false); } };
  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); setCopied(url); toast({ title: "URL copiada", description: url }); setTimeout(() => setCopied(null), 2000); };
  const fmtSize = (bytes: number) => { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB`; };
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4"><div className="text-sm text-muted-foreground"><span className="font-bold text-ink">{files.length}</span> archivos en la biblioteca</div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}{uploading ? "Subiendo..." : "Subir"}</Button><input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }} /><Button variant="ghost" size="icon" onClick={load} className="h-9 w-9" disabled={loading}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></Button></div></div>
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) doUpload(f); }} className={cn("mb-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer", dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")} onClick={() => fileRef.current?.click()}>{uploading ? (<div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-sm text-muted-foreground">Subiendo archivo...</span></div>) : (<div className="flex flex-col items-center gap-2"><Upload className="h-8 w-8 text-muted-foreground" /><span className="text-sm text-muted-foreground">Arrastra archivos aquí o <span className="text-primary font-semibold">haz clic para subir</span></span><span className="text-xs text-muted-foreground">Imágenes y videos · hasta 100MB</span></div>)}</div>
      {loading ? <div className="grid place-items-center py-12"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div> : files.length === 0 ? <div className="text-center py-8"><ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" /><p className="text-sm text-muted-foreground">No hay archivos subidos todavía.</p></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto scroll-fancy pr-1">{files.map((f, i) => { const isVideo = f.type === "video" || /\.(mp4|webm|mov|avi|mkv|ogg|3gp)$/i.test(f.name); return (<motion.div key={f.url} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.4) }} className="group relative rounded-xl border border-border bg-card overflow-hidden"><div className="aspect-square bg-muted overflow-hidden">{isVideo ? <video src={f.url} className="h-full w-full object-cover" muted /> : <img src={f.url} alt={f.name} className="h-full w-full object-cover" />}</div><div className="p-2"><div className="text-xs font-medium text-ink truncate flex items-center gap-1">{isVideo ? <Film className="h-3 w-3 shrink-0" /> : <ImageIcon className="h-3 w-3 shrink-0" />}{f.name}</div><div className="text-[0.65rem] text-muted-foreground mt-0.5">{fmtSize(f.size)}</div></div><div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); copyUrl(f.url); }} className="grid place-items-center h-7 w-7 rounded-lg bg-white/90 text-ink hover:bg-white shadow" title="Copiar URL">{copied === f.url ? <Check className="h-3.5 w-3.5 text-emerald" /> : <Copy className="h-3.5 w-3.5" />}</button></div></motion.div>); })}</div>
      )}
    </div>
  );
}
