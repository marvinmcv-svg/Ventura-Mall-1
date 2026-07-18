"use client";
import { ReactNode } from "react";
import { useSiteContent } from "@/lib/use-content";
import { ContentProvider } from "@/lib/content-context";
export function ClientContentProvider({ children }: { children: ReactNode }) {
  const { content, loading, reload } = useSiteContent();
  return <ContentProvider content={content} loading={loading} reload={reload}>{children}</ContentProvider>;
}
