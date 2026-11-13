# SignedValue

A change with its sign: `positive` for a gain, `negative` for a loss, the colour repeating the sign; muted and said "stale" once what sends it stops. `AnimatedNumber` rolls a figure's digits.

**You provide** `value`, `kind` (`money` · `percent`), `currency`; `animate`; `stale` and `staleLabel`.

```tsx
<TableCell numeric><SignedValue value={change} kind="percent" /></TableCell>
```

- A true minus (−), a plus on a gain. Zero has no sign and no colour.
- Digits roll only when the value changes in front of the reader; reduced motion shows plain text.
