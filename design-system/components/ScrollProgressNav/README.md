# ScrollProgressNav

The bar of a page's parts: it stays in view as the page scrolls, a line along its top says how far, it marks the part being read, and each part is a link to its place.

**You provide** `sections` (`[{ id, label, href?, index? }]`, each `id` the id of its part's element), `label` (`Table of contents` by default, in IoitiProvider's language); `mode` (`fixed` by default · `sticky` · `inline`), `containerRef` (the element the page scrolls in: `useMainScroll()` inside the `AppShell`), `position` (`top-center` · `bottom-center` · `top-right`, with `fixed`), `scrollThreshold`, `activeId`, `onSectionClick`.

```tsx
const main = useMainScroll()
<ScrollProgressNav label="On this page" mode="sticky" containerRef={main ?? undefined}
  sections={[{ id: 'tabs', label: 'Tabs', href: '#tabs' }, { id: 'stepper', label: 'Stepper', href: '#stepper' }]} />
```

- It follows the scroll of `containerRef` (the window's with `fixed`): the part marked is the last whose top is within 120 px of the container's top; at the end of the page, the last one begun on the screen. A part clicked stays marked until the reader scrolls on their own (wheel, touch, keys, the scroll bar), though the page can't bring it to its top. With `sticky` or `inline` and no `containerRef`, it follows nothing.
- A part with `href` is a link: a plain click scrolls to it, gives it the focus and writes it in the address in place; with ⌘ or Ctrl it opens in another tab. Give each part a `scroll-margin-top` so it lands clear of the bar.
- On a phone, its parts are a menu under a pill. The line and the current part are ink (the accent's `brand`, `brand-soft` and `brand-text` with one); `glass-float` under glass.

## Accessibility

A navigation landmark named by its `label`: its parts are the browser's own links (buttons, without `href`), the one being read said current; on a phone, a button opens their list and says whether it is open; Back to the top is a button too. A part followed is scrolled to and takes the focus, as the browser's own jump to `#part` gives it: the next Tab goes on from the part, and a screen reader reads on from it. A part that takes no focus of its own (a section) takes it for as long as it keeps it, with no ring.
