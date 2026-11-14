# NotFoundState

The page of a record that does not exist (its API answered 404): the 404's picture, what is missing, the way home and back, named in the trail and the tab as any page is.

**You provide** `title`, `description`; `name` (what the trail and the tab call it, the title by default), `parents` (`[{ label, href }]`, as `PageHeader` takes them), `suggestions` (up to three `{ label, href, description }`), `pathname` (the shell's by default), `home` (`{ href, label }`, `Back to home` at `/` by default; `null` for none), `back` (`{ label }`, `Previous page`; `null` for none), `focusOnMount` (`false` where it is drawn in a part of a page: its heading takes the focus otherwise).

```tsx
<NotFoundState title="This invoice does not exist." description="Invoice 2026-9999 was never made, or it was removed."
  name="Invoice not found"
  suggestions={[{ label: 'Invoices', href: '/invoices', description: 'Every invoice, newest first' }]} />
```

- `NotFoundPage` is the router's catch-all (`path: '*'`): "There is no page here.", an address under an entry of the menu suggesting that entry.
- `NotFound` is the page under both, for a 404 outside the shell: `errorCode`, `title`, `description`, `path`, `suggestions`, `homeHref` / `homeLabel`, `showBack`, `parallax`, `footer`, its actions as `children`.
- Home is a link; Previous page is a step back in the tab's history (`useNavigateTo()`). The heading takes the focus as the page comes, for a screen reader.
- The picture keeps its own colours (orange, white, blue glass) in both themes; the words are ink and `muted-foreground`. A list with nothing in it yet is an `EmptyState`, not a 404.
