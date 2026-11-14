# Checkbox

A box to tick, its mark drawing itself; indeterminate while some of what it stands for is ticked.

**You provide** `label`, `checked` / `defaultChecked`, `onChange`; `description` under the label; `indeterminate`; `disabled` (say why with a description or a `Hint`); `error` for a box that must be ticked.

```tsx
<Checkbox label="Keep me signed in" description="On this browser only" defaultChecked />
```

- For a setting that applies at once, use a `Switch`; a checkbox is ticked and then saved or submitted.
- Checked, it fills with `primary`, the accent's `brand` where one is chosen.
