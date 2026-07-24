"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/stores/admin-store";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";

export function AdminPortal() {
  const { open, authed, checkSession } = useAdmin();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (authed) return;
    let cancelled = false;
    checkSession().finally(() => { if (!cancelled) setChecked(true); });
    return () => { cancelled = true; };
  }, [open, authed, checkSession]);

  useEffect(() => {
    if (!open) { const t = setTimeout(() => setChecked(false), 0); return () => clearTimeout(t); }
  }, [open]);

  // Lock body scroll when the portal is open
  useEffect(() => {
    if (open) { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[100] bg-background">
          {authed ? <AdminDashboard /> : checked ? <AdminLogin /> : (
            <div className="grid place-items-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Verificando sesión...</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
