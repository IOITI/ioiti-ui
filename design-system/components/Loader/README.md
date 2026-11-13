# Loader

A wait without a known end, named for screen readers: an arc, dots, a line or rings.

**You provide** `label` (what is awaited, read out); `variant` (`arc` · `dots` · `line` · `rings`, `arc` by default); `size` (px, `32` by default); `color` (the text's colour by default); `reduceMotion` to make it only fade.

```tsx
<Loader label="Loading the orders" />
<Loader variant="dots" size={24} label="Sending" />
```

- A page or a block that loads is a `QueryState` with a `Skeleton` of what is coming, never a loader over it. Work of a known length is a `ProgressBar`.
- It is drawn near-black (near-white in dark), the accent's `brand` under an accent; `color` gives it another.
