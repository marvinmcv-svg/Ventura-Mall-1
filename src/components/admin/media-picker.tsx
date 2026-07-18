"use client";
import { useState, useRef } from "react";
import { Upload, Link2, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MediaPickerProps { value: string; onChange: (url: string) => void; label?: string; accept?: string; }
export function MediaPicker({ value, onChange, label = "Imagen", accept = "image/*" }: MediaPickerProps) {
  const [tab, setTab] = useState<"url" | "upload">("upload");
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.ok && data.url) { onChange(data.url); setUrlInput(data.url); }
      else alert(data?.error || "Error al subir");
    } catch { alert("Error de red al subir"); }
    finally { setUploading(false); }
  };
  return (
    <div>
      {label && <label className="text-xs font-semibold text-foreground mb-1.5 block">{label}</label>}
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setTab("upload")} className={cn("flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-lg border transition-colors", tab === "upload" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground")}><Upload className="h-3.5 w-3.5" />Subir</button>
        <button type="button" onClick={() => setTab("url")} className={cn("flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-lg border transition-colors", tab === "url" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground")}><Link2 className="h-3.5 w-3.5" />URL</button>
      </div>
      {tab === "upload" ? (
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f); }} className="relative rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors p-4 text-center cursor-pointer" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
          {uploading ? (<div className="flex flex-col items-center gap-1.5 py-2"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="text-xs text-muted-foreground">Subiendo...</span></div>)
            : value ? (<div className="flex flex-col items-center gap-1.5 py-1">{accept.includes("video") ? <video src={value} className="max-h-24 rounded" /> : <img src={value} alt="" className="max-h-24 rounded object-contain" />}<span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Check className="h-3 w-3 text-emerald" />Click para reemplazar</span></div>)
            : (<div className="flex flex-col items-center gap-1.5 py-2"><ImageIcon className="h-6 w-6 text-muted-foreground" /><span className="text-xs text-muted-foreground">Arrastra o click para subir</span></div>)}
        </div>
      ) : (<Input value={urlInput} onChange={(e) => { setUrlInput(e.target.value); onChange(e.target.value); }} placeholder="https://... o /images/..." className="h-10" />)}
      {value && <div className="mt-1.5 text-[0.7rem] text-muted-foreground truncate">Actual: <span className="font-mono">{value}</span></div>}
    </div>
  );
}
