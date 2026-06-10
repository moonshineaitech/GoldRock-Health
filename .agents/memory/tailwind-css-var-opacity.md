---
name: Tailwind opacity modifiers fail on CSS-var colors
description: Why bg-card/90, text-foreground/50 etc. break the Vite/PostCSS build in this repo
---

In this project, theme colors in `tailwind.config.ts` are defined as raw CSS vars
(e.g. `card: { DEFAULT: "var(--card)" }`, `--card: hsl(...)`), NOT as bare HSL
channels with `hsl(var(--card))`.

**Rule:** You CANNOT use Tailwind opacity modifiers on these tokens. Writing
`@apply bg-card/90` (or `bg-primary/20`, `text-foreground/50`, `border-border/60`)
in `client/src/index.css` throws a hard PostCSS build error:
`The bg-card/90 class does not exist` and the whole app fails to compile.

**Why:** Tailwind can only inject an alpha channel when the color value is a bare
`<h> <s> <l>` triple it controls. With a full `var(--x)` (already a complete color),
there is no slot to insert opacity, so the slashed utility is never generated.

**How to apply:**
- In CSS `@apply`, use the solid token (`bg-card`, `text-foreground`) with no slash.
- If you need translucency, use an `hsla(...)` literal in plain CSS, or apply opacity
  to a separate layer/element.
- In TSX, `bg-white/60`, `bg-black/20` etc. still work fine (those are real Tailwind
  palette colors, not the CSS-var tokens). Only the var-backed tokens (card, primary,
  secondary, muted, accent, border, foreground, background, popover, destructive,
  ring, sidebar*, chart*) reject the `/opacity` suffix.
