The primary call-to-action button — molten-orange with heat glow for the main conversion action ("Гишүүн болох"); use secondary/dark/ghost for supporting actions.

```jsx
<Button onClick={join}>Гишүүн болох</Button>
<Button variant="secondary" size="md">Дэлгэрэнгүй</Button>
<Button variant="ghost" size="sm" iconRight="→">Үнэ харах</Button>
```

- `variant`: `primary` (orange, default) · `secondary` (orange outline) · `dark` (surface) · `ghost`.
- `size`: `lg` 56px (default CTA) · `md` 44px · `sm` 38px. Always ≥44px for primary mobile actions.
- `fullWidth` for sticky bottom CTAs on mobile. `icon` / `iconRight` take any node.
- Label is auto-uppercased condensed display — write it normally.
