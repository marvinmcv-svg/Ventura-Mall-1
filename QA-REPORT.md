# QA Sweep Report — Ventura Mall — 2025-07-20

**Environment:** LOCAL (dev server :3000, SQLite local file) — safe for destructive testing
**Tester:** Z.ai Code (automated, agent-browser + curl)
**Admin creds:** Marvin / Ventura123!

---

## Coverage

- **1/1** public pages tested (`/` — single-page marketing site, 14 sections)
- **0/0** user-app pages (no separate user accounts exist — admin-only app)
- **13/13** admin portal sections tested (Resumen, Analíticas, Actividad, Tiendas, Experiencias, Promociones, Eventos, Galería, Cine, FAQ, Biblioteca de medios, Suscriptores, Mensajes, Configuración)
- **31/31** API endpoints spot-checked (24 admin + 4 public + login/logout/session + api root)
- **0/0** background jobs (none exist — no cron, queue, or webhooks)
- **1** browser engine tested (Chromium via agent-browser — WebKit/Safari not available)

---

## 🔴 Critical

**None.** No data loss, no security/auth bypass, no broken core flows. The app is usable end-to-end for all roles (public visitor + admin).

---

## 🟠 High

### 1. No security headers on any response
**Where:** all responses (server-wide — `next.config.ts` has no `headers()` config, no middleware)
**What:** None of the standard security headers are present: no `Content-Security-Policy`, no `X-Frame-Options`/`frame-ancestors`, no `Strict-Transport-Security`, no `X-Content-Type-Options`, no `Referrer-Policy`, no `Permissions-Policy`.
**Impact:** The site is vulnerable to clickjacking (iframe embedding), MIME-type sniffing attacks, and has no content security policy to mitigate XSS. For a production deployment this is a real concern, especially the clickjacking risk on the admin login.
**Steps to reproduce:** `curl -sI http://localhost:3000/ | grep -iE "content-security-policy|x-frame-options|strict-transport-security|x-content-type-options"` → no output.
**Expected:** Standard security headers present.
**Actual:** None present.
**Fix:** Add a `headers()` function to `next.config.ts` returning the standard security headers, or add `src/middleware.ts` that sets them.

### 2. Public forms accept cross-origin POSTs (CSRF / data injection)
**Where:** `src/app/api/newsletter/route.ts`, `src/app/api/contact/route.ts`, `src/app/api/track/route.ts`
**What:** These public endpoints perform state-changing writes (create subscriber, create contact message, create page view) with no `Origin` or `Referer` check. A malicious website can POST to these endpoints from a victim's browser and spam the newsletter list, flood the contact inbox, or pollute the analytics DB.
**Note:** Admin endpoints are NOT affected (protected by httpOnly SameSite=Lax cookie). Only the public write endpoints are.
**Steps to reproduce:** `curl -X POST http://localhost:3000/api/newsletter -H "Content-Type: application/json" -H "Origin: https://evil.example.com" -d '{"email":"spam@evil.com"}'` → HTTP 201 (accepted).
**Expected:** Cross-origin state-changing POSTs should be rejected or require a CSRF token / origin allowlist.
**Actual:** Accepted without question.
**Fix:** Add an `Origin`/`Referer` check in each public write route (reject if the origin doesn't match the site's domain), or add a middleware that validates the origin on all POST/PUT/DELETE.

---

## 🟡 Medium

### 3. Newsletter email is not length-capped
**Where:** `src/app/api/newsletter/route.ts:9`
**What:** The email field is trimmed and lowercased but NOT sliced to a max length. A 5000-character email was accepted and stored (verified). The contact route correctly slices all fields to 120/5000 chars; the newsletter route doesn't.
**Impact:** Storage bloat / trivial DoS — an attacker can submit arbitrarily long emails to swell the DB.
**Steps to reproduce:** `curl -X POST http://localhost:3000/api/newsletter -H "Content-Type: application/json" -d '{"email":"<5000 a's>@x.com"}'` → HTTP 201, stored.
**Fix:** Add `.slice(0, 254)` (RFC 5321 max email length) to the email before validation.

### 4. Newsletter email regex is too loose
**Where:** `src/app/api/newsletter/route.ts:7` — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
**What:** The regex accepts `<script>alert(1)</script>@x.com` as a valid email (the `<>` characters are non-space, non-`@`, so they pass). The value is stored as-is in the DB. React escapes it on render so there's no immediate XSS, but the stored value is unsafe if ever rendered in a non-React context (CSV export, email client, raw HTML).
**Steps to reproduce:** `curl -X POST http://localhost:3000/api/newsletter -H "Content-Type: application/json" -d '{"email":"<script>alert(1)</script>@x.com"}'` → HTTP 201.
**Fix:** Tighten the regex to reject angle brackets and other shell/HTML metacharacters (e.g. `/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/`), or strip dangerous characters before storage.

### 5. Deleting a non-existent admin record returns 500 instead of 404
**Where:** all admin `[id]/route.ts` DELETE handlers (e.g. `src/app/api/admin/stores/[id]/route.ts:38`)
**What:** When you DELETE a non-existent ID, Prisma throws `P2025` (record not found), which is caught by the generic catch block and returned as a 500 with `"Error al eliminar"`. The correct status is 404.
**Steps to reproduce:** `curl -X DELETE http://localhost:3000/api/admin/stores/nonexistent-id -H "Cookie: ventura_admin_session=<valid>"` → HTTP 500.
**Fix:** Check `Prisma.PrismaClientKnownRequestError` with code `P2025` in the catch and return 404.

### 6. No rate limiting on public forms or admin login
**Where:** no `src/middleware.ts`, no rate-limit dependency in `package.json`
**What:** Already noted in the prior pre-deployment audit. The admin login has no brute-force protection, and the public forms have no spam protection. Mitigated by SameSite cookies (admin) and low attack surface (marketing site), but a real concern if the site sees significant traffic.
**Fix:** Add `@upstash/ratelimit` + Redis (or `lru-cache` for single-instance) in a middleware, keyed by IP, on `/api/admin/login`, `/api/newsletter`, `/api/contact`.

### 7. Dependency audit: 30 vulnerabilities (15 high, 13 moderate, 2 low)
**Where:** `bun audit` output
**What:** After the prior audit's patches (next 16.2.10, next-intl 4.13.2, uuid 11.1.1), 30 remain. The high-severity ones are all transitive: `lodash`/`lodash-es` (via recharts), `defu`/`effect` (via prisma), `picomatch` (via eslint/next-intl), `prismjs` (via @mdxeditor), `js-cookie` (via next-auth), `postcss`. None are directly exploitable in this app's usage patterns (recharts is admin-only, prismjs is in the admin MDX editor, etc.).
**Fix:** Quarterly `bun update --latest`; pin transitive patches via `overrides` in package.json if any become exploitable.

---

## 🟢 Low / Polish

### 8. 404 page is the Next.js default, not custom-branded
**Where:** `curl http://localhost:3000/nonexistent` → `"404: This page could not be found."` with the default Next.js styling.
**Fix:** Add a custom `src/app/not-found.tsx` branded with the Ventura Mall design.

### 9. Two benign framer-motion console warnings
**Where:** `agent-browser console` shows `Please ensure that the container has a non-static position, like 'relative', 'fixed', or 'absolute' to ensure scroll offset is calculated correctly.` (×2)
**What:** Emitted by framer-motion's `useScroll` when a scroll target's ancestor isn't positioned. Cosmetic — doesn't affect functionality.
**Fix:** Add `position: relative` to the scroll-target containers, or ignore (benign).

### 10. No custom 500 page
**Where:** Next.js default error page is used.
**Fix:** Add a custom `src/app/error.tsx` branded with the Ventura Mall design.

### 11. No CSRF token on admin routes (defense-in-depth)
**Where:** all admin POST/PUT/DELETE rely solely on SameSite=Lax cookie.
**What:** Standard for same-origin admin APIs, but not defense-in-depth. A same-site XSS could still mutate admin data.
**Fix:** Add a double-submit CSRF token header check on admin mutations (optional hardening).

### 12. WebKit/Safari not tested
**What:** agent-browser only supports Chromium. Safari/iOS behavior is unverified. Low risk for a standard CSS+React site, but the mobile-majority Bolivia audience means Safari testing would be valuable.
**Fix:** Test in Safari (manual or via BrowserStack) before production launch.

---

## Not Tested / Blocked

- **No test framework installed** — no Playwright/Cypress/Jest. All testing was manual scripted E2E via agent-browser + curl. Unit/integration test coverage is zero.
- **WebKit/Safari browser engine** — not available in agent-browser. Only Chromium tested.
- **Payment/checkout flows** — none exist (pure marketing site, no commerce).
- **Background jobs/cron/queue workers** — none exist.
- **Email/SMS notifications** — none configured (no email provider, no SMS).
- **Multi-tenant isolation** — N/A (single-tenant app).
- **Concurrency/race conditions** — N/A (no booking, inventory, or limited-capacity resources).
- **Role/permission management** — N/A (single admin role, no role editor).
- **Impersonation / "view as user"** — not implemented.
- **Password reset flow** — not implemented (admin password is changed via re-seeding the DB).
- **Multi-tab/multi-session** — admin state is per-tab (Zustand store, not synced across tabs). Not a bug — expected for a client-side overlay.
- **Production build verification** — `bun run build` not run (per project rules, only dev server). The `output: "standalone"` config is set but unverified.
- **Security headers in production** — the dev server doesn't set them, but `next.config.ts headers()` would apply in production. Currently no headers config exists (see High #1).

---

## ✅ Passed (verified working)

**Public site:**
- All 14 sections render with real content (Hero → Footer), no broken images, no console errors
- Store filter pills work (Moda/Gastronomía/etc.)
- Store search input present
- Gallery lightbox opens, navigates, closes (Escape)
- FAQ accordion toggles (plus → X rotation)
- Hero CTAs scroll to correct anchors (#tiendas, #visita)
- Newsletter: valid email → 201, empty/invalid → 400
- Contact: valid → 201, missing fields → 400, SQLi-style name safely stored (Prisma parameterizes)
- Double-submit on newsletter is idempotent ("already subscribed")
- Back/forward buttons navigate anchor history correctly
- Browser zoom 200%: no clipped/overlapping content
- Refresh mid-form: no data corruption (input cleared, expected)
- Responsive: 375px / 768px / 1440px — no horizontal overflow
- Performance: page render 50-1027ms (mostly <500ms), API 8-39ms, no N+1 (single /api/content with Promise.all)

**Admin portal:**
- Login: Marvin/Ventura123! works; wrong password → 401; old admin/ventura2024 → 401
- Logout: invalidates DB session (replaying old token → 401)
- All 15 admin endpoints return 401 when unauthenticated
- All 13 admin sections render with content
- Store CRUD: create → update → delete all 200; delete confirmed gone
- Mass-assignment protected (`pick()` drops non-whitelisted fields like `role`, `id`, `createdAt`)
- CSV export works (correct content-type, content-disposition, filename)
- Settings propagation: change siteName → public /api/content reflects it → restore verified
- Timing-equalization on login (decoy verify prevents username enumeration)
- Cookie flags: httpOnly, SameSite=Lax, Secure-in-prod

**Security:**
- SQL injection: zero `$queryRaw`/`$executeRaw` (Prisma parameterizes all)
- XSS: React escapes all user content; no `dangerouslySetInnerHTML` on user content
- CORS: no permissive headers (same-origin default)
- Secrets: zero `NEXT_PUBLIC_*` vars; no secrets in client bundle
- Token entropy: 256-bit (`randomBytes(32)`)
- Password hashing: scrypt + per-user salt + timingSafeEqual

**SEO:**
- SSR meta tags: title, description, OG, Twitter, canonical, lang="es" ✅
- sitemap.xml: 200 ✅
- robots.txt: 200 ✅ (fixed during prior audit)
- JSON-LD (ShoppingCenter schema): present ✅
- /admin: 404 (not indexable) ✅

---

## Recommendation

The app is **deployable** for its intended purpose. The two High findings (security headers + public-form CSRF) should be addressed before production — both are quick fixes (a `headers()` config in `next.config.ts` and an origin check in the 3 public write routes). The Medium findings (newsletter validation, 404-on-delete) are hardening tasks that can follow shortly after. None of the findings block deployment for a staging/preview launch.

**Which bugs would you like me to fix, and in what order?**
