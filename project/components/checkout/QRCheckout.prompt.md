The QPay QR-display step of checkout. Presentation only — wire your own payment status. Toggle `status` to show the paid state.

```jsx
<QRCheckout plan="Багштай анги" amount="250,000₮" status="waiting" expiresLabel="04:58" onBack={back} />
<QRCheckout plan="Багштай анги" amount="250,000₮" status="paid" />
```

- Pass `qrSrc` with a real QPay QR image in production; otherwise a styled placeholder renders (clearly not scannable).
- `status="paid"` overlays the success check. The waiting dot pulses.
