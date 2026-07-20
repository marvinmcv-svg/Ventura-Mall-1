import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Proxy (Next.js 16 successor to middleware): CSRF origin protection + rate limiting.
 *
 * 1. CSRF: blocks cross-origin POST/PUT/PATCH/DELETE to /api/* unless Origin/Referer
 *    host matches the request Host (browser same-origin) OR no Origin/Referer is
 *    present (server-to-server curl, carries no cookies).
 * 2. Rate limiting: throttles the admin login (anti brute-force) and the public
 *    write endpoints (newsletter, contact, track) by client IP.
 */

function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

// Per-route rate limits: [pathSuffix, limit, windowMs]
const RATE_LIMITS: { path: string; limit: number; windowMs: number; key: string }[] = [
  // Admin login: 10 attempts per minute per IP (brute-force protection)
  { path: "/api/admin/login", limit: 10, windowMs: 60_000, key: "login" },
  // Public forms: 30 requests per minute per IP (spam protection)
  { path: "/api/newsletter", limit: 30, windowMs: 60_000, key: "newsletter" },
  { path: "/api/contact", limit: 30, windowMs: 60_000, key: "contact" },
  { path: "/api/track", limit: 60, windowMs: 60_000, key: "track" },
];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // --- Rate limiting (applies to ALL methods, not just writes) ---
  if (path.startsWith("/api/")) {
    const ip = getClientIp(req.headers);
    const rule = RATE_LIMITS.find((r) => path === r.path);
    if (rule) {
      const result = rateLimit(`${ip}:${rule.key}`, rule.limit, rule.windowMs);
      if (!result.ok) {
        return NextResponse.json(
          { ok: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en un momento." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(result.resetMs / 1000)),
              "X-RateLimit-Limit": String(result.limit),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }
  }

  // --- CSRF origin check (state-changing methods only) ---
  if (path.startsWith("/api/") && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const originHeader = req.headers.get("origin");
    const refererHeader = req.headers.get("referer");
    const host = req.headers.get("host");

    // No Origin and no Referer → non-browser client (curl, server-to-server).
    if (!originHeader && !refererHeader) {
      return NextResponse.next();
    }

    const originHost = originHeader ? hostFromUrl(originHeader) : refererHeader ? hostFromUrl(refererHeader) : null;

    if (!host || !originHost || originHost !== host) {
      return NextResponse.json(
        { ok: false, error: "Solicitud no permitida desde este origen." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
