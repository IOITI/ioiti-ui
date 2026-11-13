# DescriptionList

Terms and their details: a summary in rows, a record's details with its terms in a column, figures side by side, facts in a line.

**You provide** `items` (`[{ term, details }]`); `layout` (`rows` · `columns` with `termWidth` · `grid` with `columns` · `inline`); `numeric` to line figures up; `boxed`, `divided`, `compressed`.

```tsx
<DescriptionList layout="columns" termWidth="9rem"
  items={[{ term: 'Reference', details: 'IT-1042' }, { term: 'Customer', details: 'Atelier Brun, Lyon' }]} />
```

- Terms in `text-secondary`, details in `foreground`.
