# EmptyState

What a page, a panel or a table says when it has nothing to show: what is not there under a heading, why, and the way to something. `EmptyText` is one quiet line; `ErrorText` what went wrong with an action, under its button.

**You provide** `title`, `description`, `icon` (a lucide icon), `actions` (a `ButtonLink` to create, an outline `Button`); `headingLevel` one under what holds it; `density="compact"` inside a panel or across a table's columns, its heading a level lower.

```tsx
<EmptyState icon={<FileCode />} title="No detection rule yet"
  description="Rules pushed to the repository appear here, with what they detect and where they run."
  actions={<ButtonLink href="/rules/new" leftIcon={<Plus />}>Write a rule</ButtonLink>} />
```

- The title says what is not there ("No run yet"), never "No data" or "Nothing here".
