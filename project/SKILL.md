---
name: berdgym-design
description: Use this skill to generate well-branded interfaces and assets for BERD GYM MONGOLIA (a fitness club in Ulaanbaatar), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. All copy is Mongolian Cyrillic; the look is dark, heavy condensed type, single bold orange accent, oversized molten-orange prices.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

Key files:
- `readme.md` — the full design guide: content voice, visual foundations, iconography, manifest.
- `styles.css` + `tokens/*` — the design tokens (colors, type, spacing, effects) and webfonts.
- `components/**` — reusable React primitives (`Button`, `PriceBlock`, `FeatureCheck`,
  `MembershipCard`, `Badge`, `PromoBanner`, `SectionHeading`, `Input`, `QRCheckout`). Each has a
  `.prompt.md` with usage.
- `ui_kits/landing/` — the full mobile-first membership landing page + QPay checkout + 3 hero directions.
- `assets/` — logo, figure mark, and brand imagery (athletes, Greek statue, transformations).

Brand essentials: near-black grounds (`#0E0E0E`/`#1A1A1A`), a single energetic orange accent
(`#F7941D`, usually as the molten-metal gradient), white headlines, grey `#9A9A9A` support copy.
Heavy condensed UPPERCASE display (Oswald) + clean sans body (Manrope). The signature element is
the oversized orange price set like a poster headline. No emoji. Mongolian Cyrillic copy, coach-like
imperative voice.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create
static HTML files for the user to view. If working on production code, copy assets and read the
rules here to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask them what they want to build or design,
ask a few clarifying questions, and act as an expert designer who outputs HTML artifacts or
production code, depending on the need.
