"use client";
import { cn } from "@/lib/utils";
const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".ogg", ".3gp"];
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().split("?")[0];
  return VIDEO_EXTS.some((ext) => lower.endsWith(ext));
}
export function SmartMedia({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return <div className={cn("grid place-items-center bg-muted", className)}><span className="text-xs text-muted-foreground">Sin medio</span></div>;
  if (isVideoUrl(src)) return <video src={src} className={className} muted autoPlay loop playsInline aria-label={alt} />;
  return <img src={src} alt={alt} className={className} />;
}
