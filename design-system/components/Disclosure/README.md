# Disclosure

More, shown on demand: the figures of a chart as a table, the details of a request, what a setting does. It is the browser's own `<details>`, so find in the page opens it on what it finds.

**You provide** `summary` (what it holds, in a few words), the content as `children`; `variant` (`plain` in the flow of a page · `boxed` in a border of its own); `defaultOpen`, or `open` with `onOpenChange`.

```tsx
<Disclosure variant="boxed" summary="The figures as a table" defaultOpen>
  <DescriptionList compressed numeric items={figures} />
</Disclosure>
```

- The summary in `text-secondary` (`text-primary` on hover) after a chevron that turns; the box `border`, `radius-xl`.
- Its height follows what it holds, in 300ms on the design's soft curve; at once where motion is reduced.
- For a list of sections, one open at a time, use `SmoothAccordion`.
