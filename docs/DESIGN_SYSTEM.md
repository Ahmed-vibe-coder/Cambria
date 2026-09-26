# DESIGN SYSTEM & BRAND SPECIFICATION — Cambria International College Platform

## 1. Institutional Brand Heritage

The visual identity of Cambria International College is anchored entirely in its official circular institutional seal:
- **Central Iconography**: Open academic codex with radiant sunburst above, an academic quill pen laid across the text, flanked by disciplined laurel branches.
- **Symbolic Accents**: Three celestial stars arched above the codex representing Excellence, Integrity, and Knowledge.
- **Concentric Geometry**: High-precision thin double-ring institutional border encapsulating the college wordmark in geometric typography (`CAMBRIA INTERNATIONAL COLLEGE`).
- **Chromatic Restraint**: Pure Navy and Crisp White foundation. The Gold (`#C8A84E`) is a **deliberate secondary accent** (~5% maximum surface area), reserved strictly for borders, validation seals, achievement markers, and credential insignias. It is **never** used as a heavy background fill or gradient.

---

## 2. Color Palette & Token Definitions

```css
:root {
  /* Core Institutional Palette */
  --primary-navy: #020B5A;      /* Primary brand color, headers, key buttons */
  --deep-navy: #07133F;         /* Dark hero sections, institutional footer, high contrast */
  --academic-blue: #243A8F;     /* Interactive elements, active navigation, hyperlinks */
  --soft-blue: #EAF0FF;         /* Subtle card backgrounds, tinted badges */
  --off-white: #F8F9FC;         /* Canonical page background */
  --white: #FFFFFF;             /* Clean surface cards, elevated containers */

  /* Deliberate Accent Token (~5% maximum usage) */
  --gold-accent: #C8A84E;       /* Dividers, seal rims, verified checkmarks, stars */
  --gold-muted: #E2CCA0;        /* Subtle gold borders and fine line rules */

  /* Neutral Scale */
  --slate-900: #0F172A;
  --slate-700: #334155;
  --slate-500: #64748B;
  --slate-300: #CBD5E1;
  --slate-200: #E2E8F0;
  --slate-100: #F1F5F9;

  /* Lifecycle Semantic Status Tokens */
  --status-active-bg: #ECFDF5;
  --status-active-text: #065F46;
  --status-active-border: #A7F3D0;

  --status-revoked-bg: #FEF2F2;
  --status-revoked-text: #991B1B;
  --status-revoked-border: #FECACA;

  --status-suspended-bg: #FFFBEB;
  --status-suspended-text: #92400E;
  --status-suspended-border: #FDE68A;

  --status-expired-bg: #F3F4F6;
  --status-expired-text: #374151;
  --status-expired-border: #E5E7EB;

  /* Border Radius & Elevation Constraints (Mandatory Project Floor) */
  --radius-sm: 4px;             /* Buttons, badges, input controls */
  --radius-md: 6px;             /* Standard content cards, modals */
  --radius-lg: 8px;             /* Maximum allowed radius across the entire system */
  --radius: 6px;                /* shadcn override default */

  /* Border-First Shadow Tokens */
  --shadow-subtle: 0 1px 2px 0 rgba(2, 11, 90, 0.05);
  --shadow-card: 0 1px 3px 0 rgba(2, 11, 90, 0.08), 0 1px 2px -1px rgba(2, 11, 90, 0.06);
}
```

---

## 3. Typography Hierarchy

| Style / Element | Font Family | Size / Leading | Weight | Usage |
|---|---|---|---|---|
| **Display H1** | Cormorant Garamond, serif | 48px – 64px / 1.1 | 600 SemiBold | Page titles, hero value statements |
| **Heading H2** | Cormorant Garamond, serif | 32px – 40px / 1.15 | 600 SemiBold | Section headings, credential titles |
| **Heading H3** | Cormorant Garamond, serif | 24px – 28px / 1.25 | 600 SemiBold | Program titles, major headers |
| **Section Eyebrow**| Inter, sans-serif | 12px – 13px / 1.4 | 600 SemiBold | Uppercase with tracking (+0.1em), Gold or Academic Blue |
| **Body Large** | Inter, sans-serif | 18px / 1.6 | 400 Regular | Lead paragraphs, intro thesis text |
| **Body Default**| Inter, sans-serif | 15px – 16px / 1.6 | 400 Regular | Standard descriptive copy, catalog summaries |
| **Body Small / UI**| Inter, sans-serif | 13px – 14px / 1.5 | 500 Medium | Table cells, form labels, metadata |
| **Arabic Headings**| Cairo, sans-serif | 28px – 48px / 1.3 | 700 Bold | Bilingual certificates, Arabic program names |
| **Arabic Body** | Cairo / Noto Naskh Arabic | 15px – 16px / 1.7 | 400 / 500 | RTL bilingual copy, transcripts |

---

## 4. Architectural Motifs & Primitives

1. **Circular Institutional Framing**:
   - Verification badges, college crest emblems, and portrait photos are enclosed in a crisp circular container bordered by a dual-ring or gold hairline ring.
2. **Double-Ring Divider (`border-double` / Twin Parallel Lines)**:
   - Dividers separating editorial sections feature two parallel razor-thin lines (1px solid `#E2E8F0` + 1px solid `#C8A84E` or `border-double border-t-4 border-[#C8A84E]/40`).
3. **Gold Accent Star (`★`)**:
   - Used sparingly as an editorial bullet point in program features and accreditation lists. Never animated or blinking.
4. **Watermark Seal Integration**:
   - Deep Navy and Off-White sections incorporate a muted vector SVG of the college seal rendered with `opacity: 0.025` positioned as an off-center geometric watermark.
5. **Numbered Lists Over Icon Cards**:
   - Program, Major, and Service catalogs are laid out as **editorial numbered catalogs** (`01.`, `02.`, `03.`) with expansive typography and fine horizontal hairlines rather than generic SaaS card grids.
6. **Strict Border Radius Limit**:
   - Maximum radius allowed project-wide is **8px** (`rounded-lg`). **No** `rounded-2xl` or `rounded-3xl` bubble shapes are permitted.
7. **Restrained Motion Philosophy**:
   - Motion is strictly functional: 150ms–250ms ease-out transitions on hover, line width expansions, and subtle fade-ins. Zero playful bounces or floating 3D geometry.

---

## 5. shadcn/ui Component Override Configuration

All shadcn/ui components are disciplined to honor the Cambria brand tokens:
- **Button**: `rounded-[4px]`, font weight 500, primary variant uses `--primary-navy` (`#020B5A`) with crisp focus ring in `--academic-blue` (`#243A8F`).
- **Card**: `rounded-[6px]`, `border border-[#E2E8F0]`, `bg-white`, `shadow-[var(--shadow-card)]`.
- **Badge**: `rounded-[4px]`, uppercase tracking-wider text, 11px font size, subtle pastel backgrounds with matching borders.
- **Input / Select**: `rounded-[4px]`, border `#CBD5E1`, focus border `#243A8F` with 2px offset focus ring.
- **Dialog / Sheet**: `rounded-[8px]`, crisp border, backdrop with dark navy tint (`rgba(7, 19, 63, 0.4)`).
