Dark-surface text field with an orange focus ring. Used in the signup and QPay checkout flow.

```jsx
<Input label="Утас" type="tel" prefix="+976" placeholder="8800 0000" />
<Input label="Нэр" placeholder="Таны нэр" />
<Input label="Имэйл" invalid hint="Имэйл буруу байна" />
```

- `prefix` for a static lead (country code). `invalid` turns the ring + hint red.
- Always pass a `label` for accessible, branded condensed caps.
