# Badge

A short state beside what it describes: soft, solid or outline, in a tone; a dot for what is live.

**You provide** one or two words as `children`; `tone` (`neutral` · `success` · `warning` · `danger`), `variant` (`soft` · `solid` · `outline`), `dot`.

```tsx
<Badge tone="success">Paid</Badge>
```

- A tone means something; never colour a badge for decoration. The word carries the meaning, the colour repeats it.
- Set in `badge` (11px), `radius-full`. For a health check's state, use `StatusBadge`.
