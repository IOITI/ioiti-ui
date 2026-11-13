# AnimatedTabs

Views of one thing as tabs: one stop of the keyboard, whose arrows, Home and End move and choose; the background slides to the tab chosen.

**You provide** `label`, `tabs` (`[{ id, label, badge?, content?, href? }]`), `value` / `onChange` or the tabs' own state; `renderContent` to draw the chosen tab's panel; `variant="pill"`.

```tsx
<AnimatedTabs label="Orders by state" renderContent
  tabs={[{ id: 'open', label: 'Open', badge: 3, content: <OpenOrders /> }, { id: 'all', label: 'All', content: <AllOrders /> }]} />
```

- A tab whose view has an address (`?tab=`) is a link (`href`): it can be opened in another tab.
