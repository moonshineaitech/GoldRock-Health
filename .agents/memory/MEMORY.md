# Memory Index

- [Frontend build & routing gotchas](frontend-gotchas.md) — wouter v3 Link pattern (no nested `<a>`) + theme-token Tailwind opacity modifiers break PostCSS.
- [Auth fallback flow](auth-fallback-flow.md) — Clerk disabled → working login is demo login at `/welcome`; don't strand it on the catch-all.
- [Typecheck baseline](typecheck-baseline.md) — repo has a large pre-existing tsc error baseline; green dev build ≠ tsc passes. Use the `typecheck` workflow + refresh_all_logs; judge by delta.
