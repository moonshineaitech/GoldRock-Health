---
name: Typecheck tooling & pre-existing error baseline
description: How to run typecheck in this repo, and why a clean dev build does NOT mean tsc passes.
---

# Typecheck in this repo

- A dev server / Vite HMR being green does **NOT** mean `tsc` passes. This repo ships
  with a large pre-existing TypeScript error baseline (on the order of ~120 errors
  across ~25 files — luna/* components, board-exam-prep, image-analysis, storage.ts,
  routes.ts, achievementService, boardExamData, etc.). The dev runtime uses `tsx`,
  which transpiles without type-checking, so the app runs fine despite these.

**How to apply:** Judge your own changes by the *delta*, not the absolute count. After
editing, materialize a fresh typecheck and confirm (a) the total error count did not
rise and (b) your edited files are not in the error list (or have no *new* errors).
Pre-existing errors in files you didn't touch are not yours to fix.

# Running the typecheck

- `npx tsc --noEmit` inline via the bash tool **exceeds the 120s tool timeout**, and a
  backgrounded `tsc` gets killed when the shell exits.
- Reliable path: there is a dedicated **`typecheck` workflow** (`npx tsc --noEmit`).
  Restart it with `restart_workflow`, then call `refresh_all_logs` to materialize a
  fresh `/tmp/logs/typecheck_<ts>.log`. The raw `/tmp/logs` file is stale until
  `refresh_all_logs` is called. The workflow status will show **FAILED** simply because
  `tsc` exits non-zero on the baseline errors — that is expected, not a regression.
