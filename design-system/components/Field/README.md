# Field

A control under its label: the way every page lays out `Input`, `Select`, `Textarea` and `Combobox`.

**You provide** `label`, the control as `children`; `description` (what the value is for, read out with the field), `error` (what is wrong, in `negative`, read out with the control, which it marks invalid: the package's fields draw it in `negative`); `htmlFor` when the control is a `Combobox` (its label sits beside it).

```tsx
<Field label="Timeout" description="How long a request may take before it is given up">
  <Input inputMode="numeric" defaultValue="250" suffix="ms" />
</Field>
```

- The label is set in `field-label` (`text-secondary`); fields are `surface` with an `input` border, `control-height` tall, `radius-lg`.
- A unit goes in the field (`prefix`, `suffix`), not in the label. An error says how to put it right ("A whole number, from 1 to 99").
- A field that takes text shows its focus by its caret and border, never a ring.
