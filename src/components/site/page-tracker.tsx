"use client";
import { useEffect } from "react";
export function PageTracker() {
  useEffect(() => {
    let sid = sessionStorage.getItem("ventura_sid");
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("ventura_sid", sid); }
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer || null, sessionId: sid }) }).catch(() => {});
    const t = setTimeout(() => { fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: window.location.pathname + "#engaged", sessionId: sid }) }).catch(() => {}); }, 10000);
    return () => clearTimeout(t);
  }, []);
  return null;
}
