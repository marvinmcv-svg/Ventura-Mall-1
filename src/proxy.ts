import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Proxy (Next.js 16 successor to middleware): rate limiting only.
 *
 * The CSRF origin check that was here previously was too strict — it blocked
 * legitimate logins when the site is accessed through a preview proxy (where
 * the browser Origin header doesn't match the server Host). CSRF protection
 * is already handled by the SameSite=Lax admin session cookie, so the origin
 * check was redundant AND broke the admin portal in preview environments.
 *
 * What remains: rate limiting on the admin login (anti brute-force) and
 * the public write endpoints (newsletter, contact, track) by client IP.
 */

// Per-route rate limits
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

  // --- Rate limiting ---
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
