"use client";
import { useEffect, useState, useCallback } from "react";
import type { SiteContent } from "@/lib/content";
import { defaultContent } from "./default-content";

interface UseContentResult { content: SiteContent; loading: boolean; error: string | null; reload: () => Promise<void>; }

export function useSiteContent(): UseContentResult {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && data.content) { setContent(data.content); setError(null); }
      else { setError(data?.error || "Error"); }
    } catch { setError("Error de red"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { reload(); }, [reload]);
  return { content, loading, error, reload };
}
