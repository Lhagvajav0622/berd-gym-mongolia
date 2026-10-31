# BERD GYM MONGOLIA — Design System

A brand & UI design system for **BERD GYM MONGOLIA**, a fitness club in Ulaanbaatar.
The system exists to produce conversion-focused, poster-energy interfaces — above all a
**mobile-first landing page** that takes Facebook-ad visitors straight to picking a
membership and checking out via **QPay**.

> Brand feel: raw strength, discipline, athletic power — the energy of the gym's own
> posters. Heavy and confident, never soft or corporate.

---

## Sources & context

This system was built from four brand posters supplied by the client (in `assets/imagery/`):

| Source file | What it shows |
|---|---|
| `707522599_…_n.jpg` → `poster-statue.jpg` | Greek-statue strength motif + "FITNESS ХЯМДРАЛ", 3 сар 160K |
| `667913546_…_n.jpg` → `athlete-price.jpg` | Athlete with orange rim-light, 300K / 250K price stack |
| `558040317_…_n.jpg` → `coach-class.jpg`  | "Багштай анги" coached-class poster, 300K / 500K |
| `495576876_…_n.jpg` → `before-after.jpg` | "Хувийн дасгалжуулалт" before/after transformation |

Clean, textless crops were derived from these for use as imagery: `athlete-torso.jpg`,
`statue-torso.jpg`, `transform-strip.jpg`. The logo and figure mark were lifted from the
posters (`logo-berdgym-dark.png`, `mark-white.png`, `mark-orange.png`).

**Brand spec**

| Item | Value |
|---|---|
| Name | BERD GYM MONGOLIA |
| Colors | Black `#0E0E0E`, surface `#1A1A1A`, orange `#F7941D`, white, grey `#9A9A9A` |
| Type | Heavy condensed uppercase display + clean sans body |
| Phone | 86661231 (also 88069560) |
| Branch | 3, 4 хороолол салбар |
| Hours | 06:00–22:00 |
| Facebook | facebook.com/BerdGymMongolia |
| Payment | QPay (QR) |
| Language | Mongolian Cyrillic |

---

## CONTENT FUNDAMENTALS — how BERD writes

- **Language:** Mongolian Cyrillic only (incl. Mongolian-specific Өө / Үү). Latin appears
  only for borrowed fitness words — *Cardio, Fitness* — and the brand name.
- **Voice:** imperative and motivating, addressing **"чи / та"** (you). Short commands:
  *"Гишүүн болох", "Элсэлт авах", "Бүртгүүлэх"*. The brand speaks like a coach, not a salesperson.
- **Casing:** display copy is **UPPERCASE** and condensed. Body copy is sentence case.
- **The price is a sentence.** Prices are headlines — *"3 САР 160K"*, *"250K / сар"* —
  not fine print. Always the loudest element after the verb.
- **Urgency & proof:** scarcity (*"Эхний 30 хүнд хямдрал хүчинтэй"*), value framing
  (*"2 хүн хамт → 500,000₮"*), and transformation proof (*before → after*).
- **Tone words:** хүч (strength), бат бөх (solid), мэргэжлийн (professional), дэглэм
  (discipline/regimen), үр дүн (results).
- **No emoji.** Energy comes from type weight, orange, and imagery — never emoji. Check-marks
  are a graphic element (orange box ✓), not the ✅ character.
- **Examples:**
  - Hero: *"Хүч чинь дотроос эхэлнэ"* + `250K / сар`
  - Feature: *"7 хоногт 4–5 удаагийн бэлтгэл"*
  - CTA: *"Гишүүн болох"* · *"QPay-ээр төлөх"*
  - Promo: *"Наадам — Бүх багцад 20% хямдрал"*

---

## VISUAL FOUNDATIONS

**Color.** Near-black grounds (`#0E0E0E` page, `#1A1A1A` surface) carry a **single** energetic
orange accent (`#F7941D`). Orange is rationed — it appears only on prices, CTAs, headline accent
words, check-marks and active states. White for headlines, grey `#9A9A9A` for support copy.
The orange is rarely flat: prices and primary buttons use the **molten-metal gradient**
(`--grad-orange-metal`: light gold → orange → ember) for a forged, three-dimensional look.

**Type.** Display is **Oswald** (condensed, 700) set UPPERCASE with tight tracking — the poster
headline. Prices use the same face at huge sizes with the metal gradient clipped into the text.
Body is **Manrope** (clean sans). "Italic" energy is faked with a `skewX(-9deg)` transform
(`--skew-italic`) since Oswald ships no true italic — used sparingly on punchy headers.
*(Substitution note below.)*

**Backgrounds.** Full-bleed dark photography (athletes / Greek statue) under a **protection scrim**
(`--grad-hero-scrim`, dark→darker) so white type stays legible, plus a screen-blend **orange glow**
(`--grad-orange-glow`) for "heat". Non-photo sections are flat near-black or a subtle
`#0E0E0E → #131313` vertical gradient. No busy patterns; the imagery and type carry the weight.

**Imagery vibe.** Warm, high-contrast, low-key. Subjects are muscular bodies (real athletes or the
marble statue) lit dark with **orange rim-light**. Marble is the one bright element — deliberately
cool/neutral against the orange. Crops are tight and heroic (torso, abs, shoulders).

**Spacing & layout.** 4px base rhythm. Mobile-first single column (≤480px), 20px side gutters,
~52px section rhythm. Hit targets ≥44px (primary CTA 56px).

**Radii.** Cards `14–20px`, inputs `14px`, badges & buttons fully **pill** (999px). The signature
membership cards are `20px`. Nothing is sharp-cornered.

**Borders.** Hairlines are `rgba(255,255,255,.08)`; stronger card edges `rgba(255,255,255,.16)`.
The featured tier and orange elements get a `1.5–2px` solid orange border.

**Shadows & glow.** On black, drop-shadows are deep and soft (`0 14px 40px rgba(0,0,0,.55)`).
The signature effect is the **orange glow** — a colored box-shadow (`--glow-md/-lg/-cta`) around
CTAs, featured cards and prices that reads as heat. Buttons also carry an inset top glint
(`--inset-glint`) for the metal look.

**Animation.** Restrained. `--ease-out` for most transitions (~220ms); a slight overshoot
`--ease-punch` for playful moments. Buttons lift `translateY(-1px)` on hover and shrink
`scale(.975)` on press. The checkout sheet slides up. The QR "waiting" dot pulses. No infinite
decorative loops on content.

**Hover / press states.** Hover: primary brightens its glow; secondary fills 10% orange; dark
lightens one surface step; ghost turns orange. Press: scale-down. Links underline-on-hover with
3px offset.

**Transparency & blur.** Used only for the sticky header and checkout scrim
(`backdrop-filter: blur`) and the hero scrim — not as decoration.

**Cards.** Dark surface (`--grad-surface`), `1px` light border, `20px` radius, deep shadow. The
**featured** card swaps to a warm `#241a0e → surface` gradient, an orange border, and an orange
glow, with a "most popular" badge notched over the top edge.

---

## ICONOGRAPHY

- **Approach:** minimal, functional line icons + one signature graphic — the **orange check-mark**.
- **Check-marks** are the hero icon (from the posters): a rounded **orange box** (or disc) with a
  white tick, rendered as a small inline SVG inside `FeatureCheck`. This is a brand element, not a
  generic icon — reuse it for every benefit list. Never the ✅ emoji.
- **UI icons** (phone, pin, clock, Facebook) are simple 2px-stroke line icons drawn inline in the
  landing app (Feather/Lucide style). If you need a broader set, use **Lucide**
  (`https://unpkg.com/lucide-static`) — same stroke weight — to stay consistent. *(Substitution:
  the brand had no icon set of its own; Lucide-style line icons are the closest match — flag if a
  bespoke set exists.)*
- **Brand mark:** the bodybuilder silhouette (`mark-white.png` / `mark-orange.png`) is the
  app-icon / favicon / loading glyph. The full lockup is `logo-berdgym-dark.png`.
- **No emoji, anywhere.** No decorative unicode dingbats. The bullet `•` is allowed as a separator
  inside copy (e.g. *"Cardio • Fitness"*).

---

## ⚠ Font substitution — please confirm

The posters use a proprietary heavy-condensed display face. The nearest **Google Fonts** match with
full **Mongolian Cyrillic** coverage is **Oswald 700** (display) paired with **Manrope** (body).
These are loaded from the Google Fonts CDN in `tokens/fonts.css`. **If you have the brand's real
display font, send the files** and we'll self-host them (drop into `assets/fonts/`, swap the
`@import` for local `@font-face`). Also confirm Mongolian glyphs (Өө/Үү) render correctly in your
environment.

---

## Index / manifest

**Foundations**
- `styles.css` — the one entry point consumers link (`@import` list only).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `guidelines/*.html` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the
  Design System tab.

**Components** (`window.BERDGYMDesignSystem_75db46.*`)
- `components/core/` — `Button`, `Badge`, `Input`
- `components/marketing/` — `PriceBlock` ★, `FeatureCheck`, `MembershipCard`, `PromoBanner`, `SectionHeading`
- `components/checkout/` — `QRCheckout` (QPay QR state)
- Each has `.jsx` + `.d.ts` + `.prompt.md`; each directory has a `*.card.html` specimen.

**UI kit**
- `ui_kits/landing/` — the full mobile-first landing page (`index.html` + `app.jsx`), the QPay
  checkout sheet, and three hero directions (`hero-athlete`, `hero-statue`, `hero-type`).

**Assets**
- `assets/` — logo, figure marks; `assets/imagery/` — posters + clean crops.

**Other**
- `SKILL.md` — makes this folder usable as a Claude Code / Agent Skill.
