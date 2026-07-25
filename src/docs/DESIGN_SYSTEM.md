# Explore Marrakech — Design System

The goal of this system is simple: **every page should feel like the same product.**
Before adding a visual value by hand, check whether a token or primitive already
covers it. Ad-hoc values are how a product drifts into looking like five separate
websites.

All tokens live in `src/app/globals.css`. All layout primitives live in
`src/components/layout/PageShell.tsx`.

---

## 1. Colour

### Brand ramps

| Ramp | Use for |
|---|---|
| `brand-50…950` | Terracotta. Primary actions, active states, links, price. Anchored at `brand-500` = `#FF6900`. |
| `saffron-50…900` | Ratings, highlights, warm secondary accents. |
| `ink-50…950` | Warm-tinted neutrals. All text, borders and surfaces. |
| `mint-50…700` | Success states and the one cool note in the palette. |

### Why `orange-*`, `amber-*` and `gray-*` still work

Tailwind's `orange`, `amber`, `yellow` and `gray` ramps are **remapped onto our
brand ramps** in `@theme`. Older markup using `bg-orange-500` or `text-gray-600`
therefore renders in-brand automatically.

New code should prefer `brand-*`, `saffron-*` and `ink-*` — the intent is clearer.

### Semantic tokens

Prefer these over raw ramp steps for surfaces and text:

- `bg-background` (white), `bg-surface` (warm off-white), `bg-surface-sunken`
- `text-foreground`, `text-muted-foreground`
- `border-border`, `border-border-strong`
- `text-primary` / `bg-primary`

**Rule:** the page alternates `background` and `surface` bands. Cards are always
white (`surface-card`) so they lift off both.

---

## 2. Typography

One family pairing: **Outfit** for everything, **Playfair** (`font-display`) reserved
for rare editorial moments — pull quotes, not section headings.

Use the fluid `type-*` scale. It handles size, line-height, tracking and weight,
and scales from mobile to desktop without per-breakpoint guesswork:

| Class | Use |
|---|---|
| `type-display` | Homepage hero only |
| `type-h1` | Page hero title (via `PageHero`) |
| `type-h2` | Section headings |
| `type-h3` | Card group / sub-section headings |
| `type-h4` | Card titles |
| `type-lead` | Intro and subtitle paragraphs |
| `type-eyebrow` | Uppercase label above a heading |

### ⚠️ Why `type-*` and not `text-*`

`cn()` runs `tailwind-merge`, which treats **every** `text-*` class as one group.
Passing `text-h1` and `text-white` together silently drops the size. The `type-`
prefix keeps size and colour independently composable:

```tsx
// ✅ size and colour both apply
<h1 className={cn("type-h1", isBrand ? "text-white" : "text-foreground")} />

// ❌ tailwind-merge drops text-h1 — heading renders at body size
<h1 className={cn("text-h1", "text-white")} />
```

---

## 3. Layout primitives

Compose pages from these rather than hand-rolling padding:

```tsx
import { PageHero, Section, SectionHeader, Container } from "@/components/layout/PageShell";

<PageHero eyebrow="Local recommendations" title="The Best of Marrakech" subtitle="…" />

<Section tone="surface">
  <SectionHeader eyebrow="Hand-picked" title="Editor's Picks" subtitle="…" />
  {/* content */}
</Section>
```

- **`PageHero`** — the single interior-page hero. Every page below the homepage uses
  it, so navigating between sections always lands on the same shape.
  `tone="brand"` (gradient) or `"soft"`. Accepts `children` for a search field.
- **`Section`** — vertical rhythm + container. `tone`: `default | surface | sunken |
  brand | brand-soft`. `size`: `default | sm | none`. `width`: `default | wide | narrow`.
- **`SectionHeader`** — eyebrow + title + subtitle + optional right-hand action.
- **`Container`** — width only, when you need a container without section padding.

CSS equivalents exist for non-React contexts: `.app-container`, `.app-container-narrow`,
`.app-container-wide`, `.app-section`, `.app-section-sm`.

**Do not** add `pt-*` for the fixed header — `PublicLayout` already offsets `<main>`.

---

## 4. Surfaces & elevation

| Class | Use |
|---|---|
| `surface-card` | Standard card: white, `rounded-2xl`, hairline ring, soft shadow |
| `surface-card-interactive` | Same, plus lift-on-hover. Use for anything clickable |

Shadows (`shadow-xs` → `shadow-xl`) are **warm-tinted**, mixed toward `brand-950`
rather than neutral black, so elevation reads as part of the brand. `shadow-brand`
is the orange glow for primary CTAs.

Never hand-write `shadow-orange-500/20` — use `shadow-brand`.

### Radius

`rounded-xl` (20px) and `rounded-2xl` (28px) are the defaults for cards and panels.
`rounded-full` for pills, buttons and avatars. Avoid mixing more than two radii in
one component.

---

## 5. Rhythm

Driven by tokens, so spacing never drifts per screen:

- `--container-max` 1200px · `--container-narrow` 760px · `--container-wide` 1440px
- `--gutter` fluid 16→32px
- `--section-y` fluid 56→96px · `--section-y-sm` fluid 40→64px

---

## 6. Motion & accessibility

- Shared easing: `--ease-out-soft`, `--ease-in-out-soft`.
- `prefers-reduced-motion` is respected globally — don't re-add unconditional animation.
- Focus is a brand-tinted 2px outline applied globally via `:focus-visible`; don't
  remove it without providing an equivalent.
- Interactive targets keep a 44px minimum (`touch-target`).

---

## Checklist before merging UI work

1. Does a token or primitive already cover this? Use it.
2. Any raw hex, or a `text-*`/`bg-*` outside the ramps? Replace it.
3. Section built with `Section` + `SectionHeader`?
4. Heading using the `type-*` scale?
5. Does it still read as the same product as the page next to it?
