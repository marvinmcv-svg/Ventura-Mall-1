"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  open: boolean; authed: boolean; username: string | null; loading: boolean;
  setOpen: (v: boolean) => void; openAdmin: () => void; closeAdmin: () => void;
  setAuthed: (v: boolean, username?: string | null) => void;
  checkSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      open: false, authed: false, username: null, loading: false,
      setOpen: (v) => set({ open: v }),
      openAdmin: () => set({ open: true }),
      closeAdmin: () => set({ open: false }),
      setAuthed: (v, username = null) => set({ authed: v, username }),
      checkSession: async () => {
        try {
          const res = await fetch("/api/admin/session", { cache: "no-store" });
          const data = await res.json();
          if (data?.ok && data.authenticated) set({ authed: true, username: data.username });
          else set({ authed: false, username: null });
        } catch { set({ authed: false, username: null }); }
      },
      login: async (username, password) => {
        set({ loading: true });
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (data?.ok) { set({ authed: true, username, loading: false }); return { ok: true }; }
          set({ loading: false });
          return { ok: false, error: data?.error || "Error al iniciar sesión" };
        } catch { set({ loading: false }); return { ok: false, error: "Error de red" }; }
      },
      logout: async () => {
        try { await fetch("/api/admin/logout", { method: "POST" }); } catch {}
        set({ authed: false, username: null });
      },
    }),
    { name: "ventura-admin-ui", partialize: (s) => ({ open: s.open }) }
  )
);
