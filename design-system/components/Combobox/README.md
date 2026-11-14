# Combobox

One value from a list long enough to search: typing filters it, the arrows move, Enter chooses; an option may have a second line and an icon.

**You provide** `options` (`[{ value, label, description?, icon?, keywords?, disabled? }]`), `value` / `defaultValue`, `onValueChange` (the value, or `null`); `id` for its `Field htmlFor`, or `aria-label` / `aria-labelledby`; `error`; `placeholder`, `searchPlaceholder`, `emptyText`, `align` (`start` · `end`), `disabled`, `className` (`w-full` in a form, 256px wide otherwise).

```tsx
<Field label="Country" htmlFor="country">
  <Combobox id="country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Choose a country" className="w-full" />
</Field>
```

- It takes its label beside it (`Field htmlFor`), never around it: a label would pass the clicks of its options on to it.
- An option is found by its label, its description and its `keywords` ("dollar" finds USD).
- It has no `error` of its own: its `Field` says what is wrong. Several values are a `MultiSelect`; a short list, a `Select`.
