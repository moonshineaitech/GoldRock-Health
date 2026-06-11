---
name: Auth fallback flow (Clerk disabled)
description: How login works when Clerk keys are absent, and why the demo-login page must stay reachable.
---

When `VITE_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` are not set, Clerk sign-in is disabled
and the ONLY working login is the **demo login** (`POST /api/demo-login`) whose form lives on
the AuthLanding page.

Flow when Clerk is off: a CTA hits `/api/login` → server redirects to `/sign-in` → SignInPage
sees Clerk disabled and `<Redirect>`s to the AuthLanding/demo-login route.

**Decision:** the public flagship landing (`/pages/home.tsx`) is the unauth catch-all `/`, and
AuthLanding (demo login) lives at `/welcome`. SignInPage's Clerk-disabled fallback therefore
redirects to `/welcome` (NOT `/`, which would loop back to the marketing home).

**Why:** the App Store reviewer logs in via the demo-login form. If AuthLanding is bumped off
the catch-all without repointing the SignInPage fallback, every CTA loops
`/api/login → /sign-in → / → home` forever and the reviewer can't log in.

**How to apply:** if you move which page is the unauth `/`, keep `/welcome` (AuthLanding) reachable
and make sure `client/src/pages/sign-in.tsx`'s `!clerkEnabled` branch redirects there.
