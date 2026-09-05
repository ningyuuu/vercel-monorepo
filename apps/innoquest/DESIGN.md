---
name: Innoquest 2026 Test Menu
description: A warm-precision specimen ledger for Innoquest Singapore's 2026 test menu — codes, contents, and prices at point of care.
colors:
  paper: "oklch(0.995 0.004 35)"
  ink: "oklch(0.16 0.01 35)"
  kiln-terracotta: "oklch(0.44 0.125 35)"
  kiln-glow: "oklch(0.75 0.12 40)"
  warm-stone: "oklch(0.962 0.012 35)"
  warm-stone-text: "oklch(0.45 0.02 35)"
  ledger-line: "oklch(0.92 0.01 35)"
  night-paper: "oklch(0.165 0.01 35)"
  night-card: "oklch(0.215 0.012 35)"
  washed-denim: "oklch(0.424 0.199 265.638)"
typography:
  display:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 600
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  data:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontFeature: "tabular-nums"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.kiln-terracotta}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "6px 10px"
  chip-item:
    backgroundColor: "transparent"
    textColor: "{colors.warm-stone-text}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  banner-info:
    backgroundColor: "oklch(0.97 0.014 254.604)"
    textColor: "{colors.washed-denim}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  panel-table:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "4px"
---

# Design System: Innoquest 2026 Test Menu

## Overview

**Creative North Star: "The Specimen Ledger"**

A well-kept working ledger at a clinic bench: warm paper, stamp-red ink for what matters, ruled lines that never waver. The system pairs hospitality warmth (terracotta on cream, 35° hue throughout) with clinical precision (mono-spaced data, aligned grids, one frosted control strip). Everything is flat and ruled except the single lifted data panel — the ledger's working surface. Blue appears only to carry information the ledger itself doesn't own: disclaimers and provenance.

Density is comfortable-dense: the table is the product, so rows are tight, columns are proportional to content, and chrome stays quiet. Voice is warm but exacting — helpful sentences, precise numbers, no decoration that doesn't carry meaning.

**Key Characteristics:**
- One accent (Kiln Terracotta) owns wayfinding and interaction; it is rare by design
- All identifiers and prices are mono, tabular, 13px
- Flat surfaces, 1px ruled lines, one lifted panel with a soft shadow
- Frosted sticky control strip on the table (backdrop-blur over warm mute)
- Dark mode is the same ledger at night: warm near-black paper, lifted cards, glowing terracotta

## Colors

A warm monochrome world with one terracotta accent and one informational blue. Canonical values are OKLCH; light values below, dark companions noted.

### Primary
- **Kiln Terracotta** (light `oklch(0.44 0.125 35)`, dark `oklch(0.75 0.12 40)` as "Kiln Glow"): accent color, hue 35. Sort wayfinding, links, selection highlight, selection background, the display accent ("2026" in the title), allergy type chips, theme-emphasis text. Rare on any screen by design.

### Secondary
- **Washed Denim** (`oklch(0.424 0.199 265.638)`, Tailwind blue-800 family): information only — the data-source banner (blue-50 fill, blue-800 text, blue-200 border; dark: blue-950/50 fill, blue-300 text) and "Single Test" type chips. Never decorative.

### Neutral
- **Paper** (`oklch(0.995 0.004 35)`, dark `oklch(0.165 0.01 35)` "Night Paper"): page background; in dark mode cards lift to **Night Card** (`oklch(0.215 0.012 35)`).
- **Ink** (`oklch(0.16 0.01 35)`, dark `oklch(0.97 0.008 35)`): primary text.
- **Warm Stone** (`oklch(0.962 0.012 35)`, dark `oklch(0.27 0.015 35)`): muted fills — secondary badges, hover washes, the sticky strip tint.
- **Warm Stone Text** (`oklch(0.45 0.02 35)`, dark `oklch(0.74 0.02 35)`): secondary text, labels, inactive sort headers.
- **Ledger Line** (`oklch(0.92 0.01 35)`, dark `oklch(1 0.02 35 / 12%)`): all borders, inputs, dividers.

### Named Rules
**The One Ink Rule.** Terracotta is the only accent. On any screen it covers roughly 10% or less — its rarity is what makes wayfinding read instantly.

**The Informational Blue Rule.** Blue carries facts the ledger doesn't own (disclaimers, provenance, "Single Test" semantics). Blue is never decoration, never interaction.

## Typography

**Display Font:** Fraunces (optical size axis on, fallback Georgia serif)
**Body Font:** Hanken Grotesk (fallback system sans)
**Data Font:** Geist Mono (fallback system mono)

**Character:** A warm editorial serif voice for the ledger's identity moments; a quiet grotesk for all UI prose; a mono voice reserved exclusively for data. Three voices, never mixed.

### Hierarchy
- **Display** (600, text-4xl→5xl, -0.02em tracking): page title only — one per page, terracotta may color one numeral span.
- **Headline** (600, 20–24px, -0.02em): section headings (About page), Fraunces.
- **Body** (400, 16px, 1.5): prose, About paragraphs, max ~65ch.
- **Label** (500, 14px): controls, table headers (inactive at 70% ink), badge text 12px.
- **Data** (400–500, 13px, tabular-nums): codes (medium 500), costs, record counts. Always Geist Mono, always tabular.

### Named Rules
**The Data Voice Rule.** Codes and prices are always mono and always tabular — never Hanken, never proportional figures. It is how the ledger signals "this is measured fact."

## Layout

Single centered column, max-width 896px (max-w-4xl), 24px side padding, 80–96px top offset under the fixed navbar (h-16 mobile, ~69px desktop). Rhythm: 8px inside control groups, 16px between regions, generous break before the data panel — tight prelude, prominent object.

The table panel is the page's object: `rounded-xl` (14px), 1px border, 4px inset padding forming a well; sticky control strip pinned below the navbar (measured at runtime, ~69px) with `bg-muted/50` + backdrop-blur. Columns match content: Code 100px, Full Name 200px, Cost 110px, Test Contents flexible-dominant (~350px+), Remarks 110px appendix. Cells top-align so every row starts on one line.

Responsive: below 768px the table becomes a divided card list (same panel treatment); controls stack; the count badge hides. Sorting, filtering, and search behavior are identical across breakpoints.

## Elevation & Depth

Flat by default. Depth comes from 1px ruled lines and tonal layering (dark-mode card lift), not shadows.

### Shadow Vocabulary
- **Panel lift** (`shadow-sm`, Tailwind `0 1px 2px rgb(0 0 0 / 0.05)`): the data panel only — the one lifted object on the page.

### Named Rules
**The One Lifted Object Rule.** Exactly one element per page may carry a shadow: the table panel. Everything else is flat paper separated by ledger lines.

## Shapes

Ruled-rectangular world on a 10px base radius scale: 6px chips, 8px banner/inputs-sm, 10px buttons/inputs, 14px panels and cards. The panel uses a 4px inset "well": content sits 4px inside the border, so hover fills never touch the ruled edge. All lines are 1px. Chips are the only filled-small-form; badges use tinted fills with matching 25%-tint borders.

## Components

### Buttons
- **Shape:** rounded-lg (10px), height 32px, stamp-solid; active state nudges down 1px (translate-y-px) — physical stamp press.
- **Primary:** Kiln Terracotta fill, paper text. Used for the one true action per context.
- **Outline:** paper fill, ledger-line border, hover fills warm stone. Default control voice ("Clear", filters).
- **Ghost:** transparent, hover warm stone. For tertiary actions.
- **Focus:** 3px terracotta ring at 50%, border shifts to ring color.

### Chips (badges)
- **Item chips** (test contents): outline, ledger-line border, warm-stone-text text, 6px radius, 12px text, normal weight. Dense but calm — dozens per screen.
- **Type chips** (semantic): terracotta tint (allergy: primary/10 fill, primary/25 border, primary text; dark 15%) or denim tint (single test: blue-50/blue-200/blue-800 light, blue-950/blue-400-blue-300 dark). Uppercase-free, tracked slightly wide.
- **Count badge** (navbar): secondary fill (warm stone), 12px medium.

### Cards / Containers
- **Corner Style:** 14px (rounded-xl).
- **Background:** paper in light (border + shadow do the work); night-card in dark (tonal lift).
- **Shadow Strategy:** one lifted object only (see Elevation).
- **Border:** 1px ledger line.
- **Internal Padding:** 4px well inset for the table panel; 16px for content cards (banner, checkbox card).

### Inputs / Fields
- **Style:** 1px ledger-line stroke, transparent/paper fill, 10px radius.
- **Focus:** border → terracotta ring (0.62 0.11 35), 3px ring at 50%.
- **Search:** grows with content (h-auto, py-2); placeholder in warm-stone-text.

### Navigation
- Fixed top bar, paper fill, 1px bottom ledger line, h-16 mobile / ~69px desktop. Title in Hanken semibold 18px; actions right (count badge, theme toggle). Active route underlined. Title remains readable over content via opaque bar fill.

### Signature Component: The Specimen Table
The product itself. Panel object with 4px inset well → frosted sticky control strip (`bg-muted/50` + blur, terracotta active sort header at 600 weight, inactive at 70% ink) → top-aligned rows: mono codes (500), medium-weight names with semantic type chips, right-aligned mono costs, dense item chips, muted remarks appendix. Row hover fills warm stone at 50%. Sorting recolors the active header; filtering updates the mono count line ("199 of 199 records").

## Do's and Don'ts

### Do:
- **Do** keep every identifier and price in Geist Mono, tabular, 13px.
- **Do** reserve terracotta for wayfinding and interaction; when in doubt, leave it out.
- **Do** keep hue 35 across all neutrals — even borders and mutes are warm.
- **Do** top-align table cells so rows scan on one line.
- **Do** keep the disclaimer banner and its links visible and denim-tinted (binding product commitment).

### Don't:
- **Don't** introduce gradients, colored card edges, background stripes, or glass effects — the ledger is ruled paper, not a screen saver.
- **Don't** use blue for interaction or decoration; blue is information only.
- **Don't** shadow anything except the data panel.
- **Don't** fabricate data claims, dates, or testimonials in any visual treatment.
- **Don't** center-align multi-line table rows or dilute the contents column — it is the payload and takes the dominant share.
