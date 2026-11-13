# StateChip

A state the user must not miss, in the top bar of every page while it applies: a link to where it is dealt with.

**You provide** `to` (the page where it is dealt with), `tone` (`warning` to watch · `danger` to fix · `success` for good news), `icon` (a lucide icon, `className="size-3.5"`, `aria-hidden`), `label` (its words, which name it), `hint` (what it means and what to do).

```tsx
<AppShell … topBarChips={needsRestart && (
  <StateChip to="/settings" tone="warning" icon={<RotateCw className="size-3.5" aria-hidden />}
    label="Restart needed" hint="The services run an older configuration." />
)} />
```

- Shown only while the state applies, in `AppShell`'s `topBarChips`: nothing takes room while there is none.
- Under 1024px the icon alone shows; its words are its name, its meaning its `Hint` (hover, keyboard focus, a tap).
- The tones keep their colours (amber, red and emerald washes, darker words on light), never the accent's.
- It is a link (the application's, `LinkProvider`). A state of one page only is an `Alert` on that page.
