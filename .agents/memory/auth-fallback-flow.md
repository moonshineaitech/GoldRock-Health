---
name: Auth fallback flow (Clerk disabled)
description: How login works when Clerk keys are absent — the inline demo-login form on the sign-in page — and the accepted security tradeoffs.
---

When `VITE_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` are not set, Clerk sign-in is
disabled (`clerkEnabled=false`) and the ONLY working login is the **demo login**
(`POST /api/demo-login`, passport session).

**Current flow (Clerk off):** a CTA hits `/api/login` → server redirects to
`/sign-in?redirect=...` → `client/src/pages/sign-in.tsx` sees Clerk disabled and renders
an **inline Atelier email/password card** (`DemoSignIn`) that POSTs to `/api/demo-login`,
then navigates to the validated `redirect` (default `/`). There is NO separate
`/welcome` / AuthLanding page anymore.

**Decision — single landing:** the public flagship landing is `client/src/pages/home.tsx`,
served as the unauth catch-all `/`. The old duplicate `auth-landing.tsx` was **deleted**
and `/welcome` now just `<Redirect to="/" />`. The demo login moved INTO `sign-in.tsx`
(inline form), so there is no redirect-loop risk — `sign-in` renders its own form, it does
not bounce back to `/`.
**Why:** the user complained about two landing pages and broken sign-in; unifying onto
home.tsx + an inline sign-in form fixed both. Don't reintroduce a second landing page.

**Decision — accepted security tradeoffs (do not "fix" by disabling):**
- The demo login uses hardcoded reviewer credentials (in server code + replit.md) because
  it is the App Store reviewer access path AND the only working login while Clerk keys are
  declined. It is rate-limited (5 attempts / 15 min). Gating it off would break the only
  sign-in path. If real Clerk keys are ever added, prefer Clerk and consider env-gating demo.
- `redirect` params are validated as strict local paths in BOTH `getRedirect()`
  (sign-in.tsx) and `/api/login` (server/replitAuth.ts): must start with `/` but not `//`
  or `/\` (rejects protocol-relative open-redirects). Keep both in sync if you touch one.

**How to apply:** if you change which page is the unauth `/`, keep `sign-in.tsx`'s
`!clerkEnabled` branch rendering the inline demo form (not redirecting elsewhere), and keep
the open-redirect guard on any new redirect handling.
