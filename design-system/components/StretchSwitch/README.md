# StretchSwitch

A switch whose thumb stretches as it is pressed, then snaps to its side: a setting that takes effect when it is turned.

**You provide** `label`, `description`, `checked` / `defaultChecked`, `onChange`, `disabled`.

```tsx
<StretchSwitch checked={notify} onChange={setNotify} label="Notify the customer" description="An email when the order leaves" />
```

- The label and its description sit before the switch, which names and describes it for a screen reader; a press on them turns it too.
- On, the track is `text-primary` (ink), the accent's `brand` with one; off, `surface-raised` with `border`.
- It does what `Switch` does; use one or the other across an application.
