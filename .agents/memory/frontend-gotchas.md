---
name: Frontend build & routing gotchas
description: Two non-obvious frontend constraints in this repo that cause hard build errors or React warnings.
---

## wouter v3 Link — never nest an `<a>`
This repo uses wouter v3.x. `<Link>` renders its OWN `<a>`. The convention here is
`<Link href="/x" className="..." data-testid="...">children</Link>` (props pass through to the anchor).

**Do NOT** write `<Link href="/x"><a className="...">...</a></Link>` — that produces nested
`<a>` and triggers both `validateDOMNesting(<a> cannot appear as a descendant of <a>)` AND
a misleading `Invalid hook call` warning (wouter's Link internals re-run). The page may still
paint, so it's easy to miss.

**How to apply:** for internal navigation use `<Link href className>`. Use a plain `<a>` only
for hash anchors (`#features`), `mailto:`, or server routes (`/api/login`).

## Theme-token Tailwind opacity modifiers break the PostCSS build
Theme colors are defined as raw CSS vars (e.g. `--card: hsl(...)`), NOT bare HSL channels.
So opacity modifiers on THEME tokens throw a hard PostCSS build error and take the whole app down:
`bg-card/90`, `text-foreground/50`, `border-border/60`, `bg-primary/20`, `bg-secondary/40`, etc.
Applies to: background, foreground, card, popover, primary, secondary, muted, accent, border,
input, ring, destructive, chart/sidebar tokens.

**How to apply:**
- Solid token color: `bg-card`, `text-foreground` (no slash).
- Translucency: use an `hsla(...)` literal in an inline `style`, OR a real Tailwind palette
  color (`bg-white/60`, `bg-black/20`, `text-white/80` — these DO work).
- Gold accent: `var(--gold)` / `var(--gold-soft)` / `var(--gold-deep)`; gold fill =
  `linear-gradient(135deg, var(--gold-soft), var(--gold-deep))`. `font-serif` = Fraunces.

## Dark-mode fixed-background buttons
If a button has a FIXED background (e.g. `bg-white` on a dark CTA band), do NOT pair it with
`text-foreground` — `--foreground` flips to near-white in dark mode and the text vanishes.
Use a fixed ink color like `text-neutral-900`.
