---
name: GoldRock "Atelier" editorial light-luxury design system
description: The 2026 design language and how it cascades; what subagents may/may not touch
---

GoldRock Health was overhauled from "Frutiger Aero" glassmorphism (cyan/emerald
gradients, float/glow, backdrop-blur) to **"Atelier" editorial light-luxury**:
warm paper background, warm ink foreground, antique-gold signature accent, Fraunces
display serif + Inter body, flat paper cards with hairline borders + soft neutral
shadows, restrained motion. LunaFold stays a dark scientific theme (do not retint).

**Cascade is WEAKER than it looks.** Only ~5 files use the `.luxury-card`/`.glass-panel`/
`.frosted-glass` classes. ~84 of ~88 page files HARDCODE inline `bg-gradient-to-*`
(many cyan/emerald/teal). The design tokens + the 4 chrome files only fix body bg,
header, bottom nav, cards, buttons, shadcn tokens, and fonts. **Every page still needs
a manual sweep** to replace inline cyan/emerald/teal gradients with paper/ink/gold.

**Foundation files (owned serially; frozen after Phase 0 — subagents must NOT edit
these, report needed changes back instead):** `client/src/index.css`,
`tailwind.config.ts`, `client/src/App.tsx`, `client/src/components/mobile-layout.tsx`,
`client/src/components/mobile-header.tsx`, `client/src/components/mobile-bottom-nav.tsx`,
`client/src/components/medical-chatbot.tsx`.

**Never rename/delete** `.luxury-card`, `.animate-float`, `.animate-glow`,
`.medical-gradient`, `.luxury-text-gradient` — 50+ pages reference them; redefine in
place only. **Never touch** `.luna-card`/`.luna-card-gradient` (in index.css) or
`client/src/molstar.css` (LunaFold dark theme).

Key tokens: `--gold`/`--gold-soft`/`--gold-deep`, `--radius: 0.625rem`. Helpers added
in index.css `@layer utilities`: `.font-display`, `.text-gold`, `.bg-gold`,
`.border-hairline`, `.rule-gold`. h1/h2 are serif globally; h3-h6 sans.

**Status: the full light-app sweep is DONE.** Every page under `client/src/pages/**`
(incl. `pages/articles/**`) and every non-LunaFold component was converted off Frutiger
gradients to Atelier. Audit grep `from-(cyan|emerald|teal|sky|blue|indigo|purple|violet|
fuchsia|pink|rose)-[0-9]` is clean across `client/src` EXCEPT three intentional keeps:
LunaFold (luna/**, lunafold*.tsx, molstar.css — dark, untouched) and two SEMANTIC
difficulty/status ramps that must stay colored for readability — `index.css`
`.progress-foundation|clinical|expert` and `hooks/use-medical-cases.tsx`
`getDifficultyColor` (Foundation=emerald / Clinical=amber / Expert=rose). Do NOT
"fix" those to gold.
**Gold-tile recipe** for the one featured icon/CTA per view:
`style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}`
with `text-white`. Featured-only; everything else uses `bg-secondary` + muted icon.
**Frosted bottom nav bleed:** mobile-bottom-nav is correct (muted icons, gold active
rule); colored-looking tiles in screenshots are page content showing through the
frosted-glass blur, not the nav — not a bug.

**Audit recipe (don't repeat the gradient-only mistake).** A `from-{color}-N` /
gradient-only grep MISSES whole categories: (1) pages built with SOLID Frutiger
utilities (`bg-indigo-500`, `text-cyan-600`, `border-blue-200`) and no gradients —
they never get flagged or converted; (2) `backdrop-blur` glass. Always audit ALL of:
`(bg|text|border|ring|from|via|to|divide)-(blue|cyan|teal|sky|indigo|violet|fuchsia|
purple|pink)-[0-9]` AND `backdrop-blur` AND the token-opacity break
`(bg|text|border|ring)-(card|popover|primary|secondary|muted|accent|background|
foreground|border|input|destructive)/[0-9]`, excluding luna/**, lunafold*.tsx,
molstar.css, ui/**, and the frozen files. Expected clean state = only the 4 B2B pages
(for-vcs/investors=purple, for-employers/enterprise=blue single accent) match #1, and
nothing matches #2 or #3.
**Categorical color maps were rainbow too:** `hooks/use-medical-cases.tsx`
getSpecialtyColor was a full multicolor specialty map — neutralized to one
`bg-secondary text-muted-foreground border-border` chip (name text differentiates).
Only getDifficultyColor + index.css `.progress-*` keep color (the allowed semantic
ramp).
**Shared SEOHead gotcha:** `components/seo-head.tsx` `keywords` prop now accepts
`string | string[]` (some pages passed a bare string -> `keywords.join` crashed the
whole page at runtime). Keep it tolerant of both.
