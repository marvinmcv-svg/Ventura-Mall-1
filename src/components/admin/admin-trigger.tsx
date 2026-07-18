"use client";
import { Shield } from "lucide-react";
import { useAdmin } from "@/stores/admin-store";
export function AdminTrigger() {
  const { openAdmin, open } = useAdmin();
  if (open) return null;
  return (
    <button onClick={openAdmin} aria-label="Abrir panel administrativo" title="Panel administrativo (Ctrl+Shift+A)" className="fixed bottom-5 right-5 z-40 grid place-items-center h-12 w-12 rounded-full bg-ink text-white shadow-xl hover:scale-110 hover:bg-primary transition-all group">
      <Shield className="h-5 w-5 group-hover:rotate-12 transition-transform" />
    </button>
  );
}
