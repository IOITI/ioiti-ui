# Tabs

Views of one thing as tabs: one stop of the keyboard, whose arrows, Home and End move and choose; the background slides to the tab chosen.

**You provide** `label`, `tabs` (`[{ id, label, badge?, content?, href? }]`), `value` / `onChange`, or `defaultValue` (the tab shown first) and the tabs' own state; `renderContent` to draw the chosen tab's panel; `variant="pill"`.

```tsx
<Tabs label="Orders by state" renderContent
  tabs={[{ id: 'open', label: 'Open', badge: 3, content: <OpenOrders /> }, { id: 'all', label: 'All', content: <AllOrders /> }]} />
```

- A tab whose view has an address (`?tab=`) is a link (`href`): it can be opened in another tab.
- Formerly `AnimatedTabs`, removed in 1.0: `npx ioiti-ui-codemod` rewrites it.

## Accessibility

Tabs that switch views are a tab list named by `label`, each tab said selected or not; with `renderContent`, the view is a panel named by its tab, a stop of the keyboard after them. Tabs with an `href` are links instead, the one shown said current, each a stop of its own.

| Key | What it does |
|---|---|
| Tab | Onto the tab chosen; from it, into its panel |
| →, ← | The next tab, or the one before, chosen at once; past the last, the first again |
| Home, End | The first tab, the last |
| Enter | On a tab that is a link: follows it |
