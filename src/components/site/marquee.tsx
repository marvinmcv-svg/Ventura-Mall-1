"use client";

import { useContent } from "@/lib/content-context";

export function Marquee() {
  const { content } = useContent();
  let items: string[] = [];
  try { items = JSON.parse(content.settings.marqueeItems || "[]"); } catch { items = []; }
  if (!items.length) return null;
  const loop = [...items, ...items, ...items];
  return (
    <div className="bg-ink text-white py-2.5 sm:py-3 overflow-hidden border-y border-white/10 relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((it, i) => (
          <span key={i} className="inline-flex items-center mx-4 sm:mx-6 text-xs sm:text-sm font-medium">
            <span className="mr-3 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-gold" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
