Top campaign strip for seasonal discounts (Наадам / Шинэ жил / Зун). Stick it to the very top of the page; designed to support a later-toggled seasonal promo.

```jsx
<PromoBanner label="Наадам" message="Бүх багцад 20% хямдрал" cta="Авах" onClose={() => setOpen(false)} />
<PromoBanner tone="dark" label="Зун" message="Зуны багц 160K-аас" />
```

- `tone`: `orange` solid molten bar (default, loudest) · `dark` near-black with orange accents.
- Pass `onClose` to make it dismissable. Keep the message to one short line for mobile.
