# Landing — BERD GYM membership

Mobile-first landing for Facebook-ad traffic. Single goal: pick a membership and check out.

## Files
- `index.html` — mounts the React app; loads `styles.css` + `_ds_bundle.js`. **Full landing page.**
- `app.jsx` — all sections + the QPay checkout sheet, composed from design-system components.
- `hero-athlete.html` — **Direction A · Athlete Heat** (committed hero; photographic, immersive).
- `hero-statue.html` — **Direction B · Timeless Power** (Greek-statue motif, editorial).
- `hero-type.html` — **Direction C · Poster Type** (type-forward, minimal imagery).

## Section order (app.jsx)
1. `PromoBanner` — seasonal campaign strip (Наадам / Шинэ жил / Зун), dismissable.
2. `Header` — sticky logo + phone.
3. `Hero` — full-bleed athlete, orange glow, mega `PriceBlock`, dual CTA, trust meta.
4. `Features` — "Яагаад БЭРД?" orange `FeatureCheck` list.
5. `Pricing` — three `MembershipCard`s (1 сар / Багштай анги ★ / 3 сарын багц).
6. `PTHighlight` — personal training, before/after transform strip.
7. `Footer` — phone, branch, hours, Facebook.
8. `StickyCTA` — fixed bottom "Гишүүн болох" on mobile.
9. `Checkout` — bottom-sheet: details → QPay QR (`QRCheckout`) → paid. **Design only, no payment logic.**

## Hero directions
Three distinct directions are provided for the user to choose. The full page currently commits to **Direction A**. To switch, swap the `Hero` component's background image / layout to match B or C.

## Notes
- The QR in checkout is a styled placeholder (clearly not scannable). Pass a real QPay QR image to `QRCheckout`'s `qrSrc` in production.
- All copy is Mongolian Cyrillic. Phone/branch/hours from the brand spec.
