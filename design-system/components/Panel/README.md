# Panel

The box every section of a page sits in: a hairline `border` at 70%, `surface` at half its strength over `background`, `radius-2xl` corners, a `section-title` heading and its body padded `panel-padding`.

**You provide** `title`, `description`, an `action` on the right (a small outline button, a quiet `TextLink`), the body as `children`; `dense` brings the body close under the title for a list or a table; `id` makes it a target. A box set apart in it is a `PanelInset` (`className`, `children`).

```tsx
<Panel title="Latest orders" description="The five sent last."
  action={<Button size="sm" variant="outline">View all</Button>} dense>
  <Table aria-label="Latest orders">…</Table>
</Panel>
```

- What is inside a panel has no second card around it; a nested box is a `PanelInset`: `radius-xl`, a fainter border, `surface-raised` at 60%, `glass-raised` under glass.
- Rows inside are apart by `border` at 40%. Under glass a panel is `glass-card` with an edge lit at its top.
