A membership pricing tier — the oversized price is the visual centrepiece. Mark the recommended tier `featured` for the orange border, glow and badge.

```jsx
<MembershipCard
  title="Багштай анги" subtitle="Мэргэжлийн дасгалжуулагчтай"
  amount="250K" oldAmount="300K" unit="/ сар"
  features={['7 хоногт 4–5 удаа', 'Хоолны дэглэм', 'Cardio • Fitness']}
  featured badge="Хамгийн эрэлттэй"
  onSelect={() => openCheckout('coach')}
/>
```

- Composes `PriceBlock`, `FeatureCheck`, `Badge`, `Button` — don't re-implement those.
- Only ONE tier per row should be `featured`. `oldAmount` shows the crossed-out discount price.
