# Badge

A short state beside what it describes: soft, solid or outline, in a tone; a dot for what is live.

**You provide** one or two words as `children`; `tone` (a `StatusTone`: `neutral` · `info` · `success` · `warning` · `danger`), `variant` (`soft` · `solid` · `outline`), `dot`.

```tsx
<Badge tone="success">Paid</Badge>
```

- A tone means something; never colour a badge for decoration. The word carries the meaning, the colour repeats it.
- Set in `badge` (12px, medium), `radius-full`. A count in a dot or beside a menu's entry is `micro` (11px). For a health check's state, use `StatusBadge`.
