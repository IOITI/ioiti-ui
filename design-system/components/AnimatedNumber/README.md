# AnimatedNumber

A figure whose digits roll to each new value: a count that changes in front of the reader, a total recomputed. Plain text where motion is reduced.

**You provide** `value`; `decimals`, `useGrouping` (on: "1,250"), `compact` ("1.2K"), `prefix` and `suffix` (" orders"); or `text`, the value as the application's formats write it (`formatMoney`), whose digits roll while the rest stays.

```tsx
<AnimatedNumber value={orders} className="text-3xl font-semibold" />
<AnimatedNumber value={total} text={formatMoney(total, 'EUR')} />
```

- Digits of one width (`tabular-nums`) on the baseline of the text around them; its colour is the text's.
- A screen reader hears the value once, as text: the rolling digits are hidden from it.
- Only for a figure that changes while it is read; a figure that comes with the page is plain text. A signed change that rolls is a `SignedValue` with `animate`; a figure that flashes its tone as it changes, a `LiveValue`.
