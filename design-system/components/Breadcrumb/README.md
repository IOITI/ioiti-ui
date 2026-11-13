# Breadcrumb

Where a page is, from Home; too many steps fold into "…". The top bar draws one on every page (`TopBarTrail`).

**You provide** `items` (`[{ label, href? }]`, the last one the page, without `href`); `separator` (`chevron` · `slash`); `maxItems`.

```tsx
<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Customers', href: '/customers' }, { label: 'Acme' }]} />
```

- In the shell the trail is built from the menu and `PageHeader`'s `parents`: do not add a second breadcrumb to a page.
