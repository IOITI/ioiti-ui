# ButtonLink

A link drawn as a button: what leads to another page, followed through the router and opened in another tab with ⌘ or Ctrl.

**You provide** `to` (the path; `null` for a button that cannot be pressed, there being nowhere to go), the words as `children`; `variant` and `size` as a `Button`'s (`primary` and `md` by default), `leftIcon` / `rightIcon`; `reloadDocument` for an address the server answers and the router does not know (a sign-in through an identity provider, a file).

```tsx
<ButtonLink to="/components/forms">Go to the forms</ButtonLink>
<ButtonLink to={null} variant="outline" size="sm">No day before the first</ButtonLink>
```

- What does something is a `Button`; what leads somewhere is a `ButtonLink`, or a `TextLink` in words.
- It is drawn by the application's link (`LinkProvider`), a plain `<a>` without one: a plain click goes through the router, a click with a modifier is left to the browser.
- It looks and presses as a `Button` does: `primary` (ink) filled, the accent's `brand` where one is chosen.
