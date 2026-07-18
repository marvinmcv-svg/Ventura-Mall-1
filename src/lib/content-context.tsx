"use client";
import { createContext, useContext, ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import { defaultContent } from "@/lib/default-content";

interface ContentCtx { content: SiteContent; loading: boolean; reload: () => Promise<void>; }
const Ctx = createContext<ContentCtx>({ content: defaultContent, loading: false, reload: async () => {} });

export function ContentProvider({ content, loading, reload, children }: {
  content: SiteContent; loading: boolean; reload: () => Promise<void>; children: ReactNode;
}) {
  return <Ctx.Provider value={{ content, loading, reload }}>{children}</Ctx.Provider>;
}
export function useContent() { return useContext(Ctx); }
