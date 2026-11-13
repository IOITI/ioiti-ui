# PageHeader

The title of a page and what it does, with its actions on the right; it names the browser tab and ends the top bar's trail.

**You provide** `title`, a one-sentence `description`, `actions` (a `ButtonLink` to create, a `Button` to act); `parents` (`[{ label, href }]`) for the pages between the menu and this one; `name` when a record's header stays the title while one of its tabs is shown.

```tsx
<PageHeader title="Orders" description="Every order, newest first."
  actions={<ButtonLink to="/orders/new" size="sm" leftIcon={<Plus />}>New order</ButtonLink>} />
```

- One a page, set in `page-title` (h1). It is the page's first block.
- The title is a noun; the description says what is there and in what order.
