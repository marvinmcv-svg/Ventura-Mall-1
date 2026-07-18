"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/stores/admin-store";
import { useToast } from "@/hooks/use-toast";

export function AdminLogin() {
  const { login, loading, closeAdmin } = useAdmin();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { const t = setTimeout(() => document.getElementById("admin-user")?.focus(), 100); return () => clearTimeout(t); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await login(username.trim(), password);
    if (!r.ok) { toast({ variant: "destructive", title: "Acceso denegado", description: r.error }); }
    else { toast({ title: "Bienvenido", description: `Sesión iniciada como ${username.trim()}` }); setPassword(""); }
  };

  return (
    <div className="min-h-full w-full grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-ink text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-xl shadow-lg">V</span>
            <div><div className="font-display font-extrabold text-xl leading-none">Ventura Mall</div><div className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold mt-1">Portal Administrativo</div></div>
          </div>
        </div>
        <div className="relative">
          <ShieldCheck className="h-12 w-12 text-gold mb-4" />
          <h2 className="font-display font-extrabold text-3xl text-balance leading-tight">Gestiona cada detalle de Ventura Mall</h2>
          <p className="mt-3 text-white/70 text-pretty max-w-md">Edita tiendas, experiencias, promociones, eventos, cine, galería, FAQ y la configuración general del sitio. Los cambios se reflejan al instante.</p>
        </div>
        <div className="relative text-xs text-white/50">© {new Date().getFullYear()} Ventura Mall · Santa Cruz, Bolivia</div>
      </div>
      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-background">
        <button onClick={closeAdmin} className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" />Volver al sitio</button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-primary-foreground font-display font-extrabold text-xl">V</span>
            <div><div className="font-display font-extrabold text-lg leading-none">Ventura Mall</div><div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary mt-1">Portal Administrativo</div></div>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ingresa tus credenciales de administrador para continuar.</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div><label htmlFor="admin-user" className="text-xs font-semibold text-foreground mb-1.5 block">Usuario</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="admin-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoComplete="username" className="pl-9 h-11" required /></div></div>
            <div><label htmlFor="admin-pwd" className="text-xs font-semibold text-foreground mb-1.5 block">Contraseña</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="admin-pwd" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="pl-9 pr-10 h-11" required /><button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPwd ? "Ocultar" : "Mostrar"}>{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verificando...</> : <><Lock className="mr-2 h-4 w-4" />Entrar</>}</Button>
          </form>
          <div className="mt-6 rounded-xl bg-muted/60 border border-border p-3.5 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Credenciales demo:</span> admin / ventura2024</div>
        </motion.div>
      </div>
    </div>
  );
}
