# Master Prompt: Full Application QA & Regression Test Sweep (v2)

> Paste this into your coding agent (Claude Code, Cursor, etc.) inside the project repo.
> Fill in the bracketed `[ ]` placeholders before running.

---

## ROLE

You are acting as a senior QA engineer performing a full manual + automated regression test of this application. Your job is NOT to write new features. Your job is to **click, submit, and exercise every reachable part of the app** (public app, authenticated app, and admin portal), log what breaks, and report back with a prioritized bug list.

Do not silently "fix and move on" — flag issues first, then ask before making changes unless told otherwise. Do not modify application code to make something "pass." If a screen is untestable without a code change (e.g., missing `data-testid` hooks), say so in the report and ask before touching source.

---

## 0. SAFETY GUARDRAILS (read before doing anything)

1. **Never run this against production with real user/customer/student/patient data.** Confirm the target environment out loud before starting. If only a production URL is available, test read-only flows (page loads, navigation, console errors) and explicitly skip anything destructive (delete, refund, bulk actions, payment capture) — list those under "Not Tested / Blocked," don't attempt them.
2. If testing against a shared staging environment, **snapshot or note the current DB state first** so destructive test actions (deletes, bulk edits) can be distinguished from real regressions by other engineers using the same environment.
3. Use only test/sandbox credentials for third-party services (Stripe test mode, sandbox email provider, etc.). Never use live API keys, live payment methods, or send real emails/SMS to real numbers.
4. If a test action would email, text, or notify a real person (not a seeded test account), skip it and flag it — don't fire it "to see what happens."
5. If you need to install anything beyond an existing or newly-added Playwright setup, ask first rather than introducing a second test framework or unrelated dependencies.

---

## 1. SETUP

1. Read the codebase structure first (`package.json`, routes/pages folders, `README`, `.env.example`) to build a full sitemap: every route, every role, every environment variable needed to run locally or in staging.
2. Identify the tech stack and testing tools already available (Playwright, Cypress, Puppeteer, etc.). If none exist, install **Playwright** (or reuse an existing e2e framework already in the repo — don't introduce a second one).
3. Identify all user roles/account types this app has, e.g.:
   - Public/anonymous visitor
   - Standard authenticated user
   - [ROLE 3 — e.g. staff/teacher/clinician]
   - Admin / superadmin
   - Any billing/owner role
   - If multi-tenant: at least two separate tenant/org accounts, to test cross-tenant isolation
4. Confirm or create test credentials for each role (use seed data / test accounts — never production data). List them at the top of your test log.
5. Confirm the base URL(s) you're testing: `[LOCAL / STAGING / PROD-READ-ONLY URL]`.
6. Note any feature flags or A/B experiments active in this environment — test both states if flags gate meaningfully different behavior.

---

## 2. SITE MAP & COVERAGE CHECKLIST

Before testing, output a full checklist of every route/page/screen you found, grouped by:
- **Public pages** (marketing, login, signup, password reset, etc.)
- **Authenticated user app** (every screen behind login)
- **Admin portal** (every screen behind admin auth)
- **API endpoints** hit by the frontend (list them; you'll verify each returns correct status codes/data)
- **Background jobs / scheduled tasks** (cron jobs, queue workers, webhooks received) — list what triggers them

This checklist becomes your test plan — nothing gets marked "tested" until it's actually been exercised in the browser/automation, not just read from code.

---

## 3. FUNCTIONAL TEST PASS — PUBLIC + USER APP

For every page in the checklist:

- [ ] Page loads without console errors, network errors (4xx/5xx), or broken images/assets
- [ ] Every button, link, tab, and menu item is clickable and goes where it should
- [ ] Every form: submits successfully with valid data, shows proper validation errors with invalid/missing data, and shows a clear success/failure state (no silent failures)
- [ ] Every input type is tested: empty, min/max length, special characters, emoji, SQL-injection-style strings, XSS payloads (`<script>`, event-handler attributes), very long strings, wrong data type (letters in a number field, etc.)
- [ ] **Double-submit / idempotency**: rapid double-click on submit/checkout/payment buttons — confirm it doesn't create duplicate records or duplicate charges
- [ ] File uploads (if any): correct file types accepted, wrong types rejected, large file handled gracefully, and — if the upload accepts a URL — confirm it can't be used to fetch internal/local network addresses (SSRF)
- [ ] Search/filter/sort features return correct, expected results — including empty-result states
- [ ] Pagination works at the start, middle, and end of a dataset
- [ ] Loading states, empty states, and error states all render (don't just test the "happy path" data)
- [ ] Logout, session expiry, and "not authorized" redirects work correctly
- [ ] Auth: login with correct creds, incorrect password, non-existent user, locked account (if applicable), password reset flow end-to-end, and confirm session tokens are invalidated on logout (not just cleared client-side)
- [ ] Any payment/checkout flow: test with test-mode payment provider, including a **declined** card path, not just success — and confirm a webhook replay or delayed webhook doesn't double-fulfill an order
- [ ] Notifications/emails triggered by actions actually fire (check logs/test inbox, never a real address)
- [ ] Mobile responsive check at 375px, tablet at 768px, desktop at 1440px — nothing overlaps, clips, or becomes unusable
- [ ] Browser back/forward buttons don't break app state
- [ ] Refreshing mid-flow (e.g., mid-form, mid-checkout) doesn't corrupt data or crash the page
- [ ] Multi-tab/multi-session: same account open in two tabs — confirm state changes in one reflect (or gracefully conflict) in the other
- [ ] If the app is bilingual/multi-locale: confirm both languages render fully (no untranslated fallback strings), and date/number/currency formats match the locale

---

## 4. ADMIN PORTAL — TEST WITH EXTRA SCRUTINY

Admin portals get their own pass because they carry the highest blast radius if broken. For every admin screen:

- [ ] Confirm **only** admin roles can access it — attempt to access every admin URL directly while logged out, and while logged in as a non-admin user. Expect a hard redirect/403, not a blank page or partial render. Test the underlying API route directly too, not just the UI.
- [ ] CRUD operations on every entity the admin manages (users, content, orders, settings, etc.): Create, Read, Update, **and Delete** — including confirming delete has a confirmation step and actually removes/soft-deletes the record (check the DB, not just that it disappeared from the UI).
- [ ] Bulk actions (bulk delete, bulk export, bulk status change) work and match the count of items actually selected
- [ ] Admin-only destructive actions (ban user, refund payment, reset data, impersonate user) work correctly AND are logged/audited if the app has an audit trail
- [ ] Role/permission management: create a new role, assign it, confirm the permission boundary actually restricts access in a real session (not just hidden UI — test the underlying route/API too)
- [ ] Mass-assignment check: try submitting extra/unexpected fields in an update request (e.g., `role: "admin"`, `isVerified: true`) as a lower-privileged user and confirm the server ignores/rejects them
- [ ] Data tables: sorting, filtering, search, export (CSV/PDF) all match what's on screen
- [ ] Dashboard/analytics widgets show numbers that reconcile with the underlying data (spot-check at least 2-3 metrics against raw records)
- [ ] Settings changes made in the admin portal actually propagate to the user-facing app (test both sides)
- [ ] Impersonation / "view as user" features (if present) correctly scope permissions, clearly indicate impersonation is active on screen, and end cleanly (no leftover elevated session)
- [ ] Test what happens when two admins edit the same record simultaneously (race condition / stale data / last-write-wins check)
- [ ] If multi-tenant: confirm an admin from Tenant A cannot see, edit, or export Tenant B's data by manipulating IDs or org-scoped parameters

---

## 5. DATA INTEGRITY & BACKGROUND PROCESSES

- [ ] Trigger every background job / scheduled task at least once (queue worker, cron, webhook receiver) and confirm it completes and updates the expected records
- [ ] Force a job to fail mid-way (bad input, killed process if feasible) and confirm retry/dead-letter behavior doesn't duplicate or lose data
- [ ] Delete a parent record that has dependent child records — confirm cascade behavior (cascade delete, restrict, or soft-delete) matches what's expected, not just "no error thrown"
- [ ] Concurrency: two near-simultaneous actions against the same limited resource (last item in stock, last seat, same coupon code) — confirm no overselling/double-booking
- [ ] Confirm seed/test data can be reset to a clean state without manual DB surgery

---

## 6. API & SECURITY SPOT-CHECKS

- [ ] Every API call the frontend makes returns the correct status code for success and failure cases
- [ ] Direct API calls (via curl/Postman) to admin-only endpoints without a valid admin token/session return 401/403, not 200
- [ ] IDs in URLs (e.g. `/user/123`, `/order/456`) can't be incremented/guessed to view another user's data (IDOR check) — try changing an ID as a lower-privileged user
- [ ] CSRF: confirm state-changing requests (POST/PUT/DELETE) are rejected without a valid CSRF token/origin when replayed from a different origin
- [ ] CORS: confirm the API doesn't reflect an arbitrary `Origin` header with `Access-Control-Allow-Credentials: true`
- [ ] Security headers present on responses: CSP, `X-Frame-Options` or `frame-ancestors`, `Strict-Transport-Security`, `X-Content-Type-Options`
- [ ] Rate limiting or abuse protection on login/signup/password-reset forms (if expected) actually triggers after N attempts
- [ ] Environment secrets are not exposed in frontend bundle, console, network tab, or client-visible source maps
- [ ] `npm audit` (or stack equivalent) run once and high/critical findings noted, even if not fixed
- [ ] Quick check for committed secrets in the repo (`.env` files, API keys) — flag, don't fix without asking

---

## 7. CROSS-CUTTING CHECKS

- [ ] Run through the full app in at least 2 real browser engines with specific versions noted (e.g., Chrome [version], Safari [version] — not just "Safari")
- [ ] Accessibility: keyboard-only navigation reaches every interactive element and shows visible focus; form fields have programmatic labels; modals trap and restore focus correctly; color contrast isn't broken; test at least the core user flow with a screen reader (VoiceOver/NVDA), not keyboard-only
- [ ] Browser zoom to 200% and confirm no clipped/overlapping content
- [ ] Performance: capture actual load-time numbers for each major page (not just "felt slow") and flag any page over ~3s TTI or any API call over ~1s; note obvious N+1 query patterns
- [ ] Simulate a slow/throttled network (e.g., Fast 3G in devtools) on at least the core flow — confirm loading states appear and nothing silently fails
- [ ] Check for orphaned/dead routes (pages that exist in code but are unreachable from any nav — flag them, don't assume they're intentional)

---

## 8. OUTPUT FORMAT

Severity is assigned by these criteria, not by feel:
- **🔴 Critical** — data loss/corruption, security/auth bypass, payment double-charge or failure, or the app is unusable for a whole role
- **🟠 High** — a core feature is broken with no workaround, or an admin-only function fails
- **🟡 Medium** — validation/UX issue, workaround exists, non-blocking
- **🟢 Low** — visual/copy/polish only

For every 🔴/🟠 bug, capture a screenshot or short screen recording and attach the file path in the report — don't describe a bug without evidence if your tooling can capture it.

```
## QA Sweep Report — [App Name] — [Date]

### Coverage
- X/X public pages tested
- X/X user-app pages tested
- X/X admin pages tested
- X/X API endpoints spot-checked
- X/X background jobs triggered

### 🔴 Critical
1. [Page/Feature] — [What happened] — [Steps to reproduce] — [Expected vs actual] — [Evidence file]

### 🟠 High
...

### 🟡 Medium
...

### 🟢 Low / Polish
...

### Not Tested / Blocked
- [Anything you couldn't test and why — missing test data, env not available, destructive/prod-risk action skipped, etc.]
```

Do not fix anything yet — report first. I'll tell you which bugs to fix and in what order.

---

## NOTES FOR THE AGENT
- Use real interaction (click/type/submit) via your automated browser tool, not just static code review — code review alone doesn't catch runtime bugs, broken API contracts, or CSS issues.
- If you find yourself unable to test something (missing seed data, missing 3rd-party sandbox keys, prod-only environment), say so explicitly in "Not Tested / Blocked" rather than skipping it silently or faking a pass.
- Prioritize breadth first (touch every screen) before depth (edge cases on one screen) — a full-coverage pass with lighter edge-case testing is more valuable than deep-testing 20% of the app.
- Never take an action in Section 0's guardrail list without explicit confirmation that the environment is safe to do so in.
