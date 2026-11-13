# CheckList

Checks and what each found: passed, failed and open told apart by an icon (`CheckIcon`) as well as by colour, and named for screen readers.

**You provide** `checks` (`[{ id, label, state, detail }]`, `state` being `pass` · `fail` · `open`), `label` (the list's name); `hrefOf` (a check to its address, or `null`) to make a check's name a link; `className` for its columns (`sm:grid-cols-3`). `CheckIcon` takes `state`, and `named={false}` when the words beside it already say the outcome.

```tsx
<CheckList label="Before releasing" className="sm:grid-cols-3"
  checks={[{ id: 'tests', label: 'Tests', state: 'pass', detail: '142 passed in 6 s.' },
           { id: 'review', label: 'Review', state: 'open', detail: 'Not asked yet.' }]} />
```

- Passed is `positive`, failed `negative`, open `muted-foreground`; each detail is one sentence in `muted-foreground`.
- A check that is still running is `open` until it has an outcome. The state of a service is a `StatusBadge`.
