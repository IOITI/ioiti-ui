# ExportButton

Saves the rows a page shows as a CSV file named with the day, spreadsheet formulas neutralised.

**You provide** `name` (the file's name without the day or the extension: `items` saves `items-2026-10-26.csv`), `rows` (those loaded on the page), `columns` (`[{ header, value: (row) => … }]`).

```tsx
<ExportButton name="items" rows={rows} columns={[
  { header: 'Id', value: (row) => row.id },
  { header: 'Item', value: (row) => row.name },
  { header: 'Amount', value: (row) => row.amount },
]} />
```

- It is an outline `sm` button, "Export CSV" with a download icon, beside the table it saves. With no rows, it cannot be pressed.
- Numbers stay numbers; a text cell that starts with `=`, `+`, `-` or `@` is written so that a spreadsheet does not run it. The file starts with a byte-order mark, so Excel reads it as UTF-8.
- For another trigger, or other words, use `toCsv(rows, columns)` and `downloadCsv(filename, content)`.
