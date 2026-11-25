# Combobox

One value from a list long enough to search: typing filters it, the arrows move, Enter chooses; an option may have a second line and an icon.

**You provide** `options` (`[{ value, label, description?, icon?, keywords?, disabled? }]`), `value` / `defaultValue`, `onChange` (the value, or `null`); `error`; `placeholder`, `searchPlaceholder`, `emptyText`, `align` (`start` · `end`), `disabled`, `className` (`w-full` in a form, 256px wide otherwise). Its name, which names its search and its list too: a `Field` beside it (`htmlFor` and its `id`) or a `FormItem`, else `aria-label` / `aria-labelledby`. In a form: `name`, the value chosen (empty while none is). `id`, `ref` (its button), `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<Field label="Country" htmlFor="country">
  <Combobox id="country" options={COUNTRIES} value={country} onChange={setCountry} placeholder="Choose a country" className="w-full" />
</Field>
```

- It takes its label beside it (`Field htmlFor`), never around it: a label would pass the clicks of its options on to it.
- An option is found by its label, its description and its `keywords` ("dollar" finds USD).
- It has no `error` of its own: its `Field` says what is wrong. Several values are a `MultiSelect`; a short list, a `Select`.

## Accessibility

Its button is a combobox named by its label, which says the value chosen and that it opens a list. Open, the focus is in its search, named as the button is, which says the option the arrows are on and whether it is the one chosen. An option that cannot be chosen is said dimmed, and the arrows pass it by. When its search finds nothing, the list is empty and "No results." (`emptyText`) is shown beside it, describing it, and said to a screen reader once, as MultiSelect says it.

| Key | What it does |
|---|---|
| Enter, Space, ↓, ↑ | On its button: open the list, the focus in its search |
| Letters | Typed in the search: filter the list |
| ↓, ↑ | The next option, or the one before; past the last, the first again |
| Home, End | The first option, the last |
| Enter | Chooses the option and closes the list, the focus back on the button |
| Escape, Tab | Close the list without a change, the focus back on the button |
