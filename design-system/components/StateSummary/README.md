# StateSummary

The states the user must not miss, in one control of the top bar: the gravest one's words in its tone, how many more, and a dot while all is well. It opens on every state, each a link to where it is dealt with.

**You provide** `items` (`[{ id, tone, icon?, label, detail?, href? }]`, `tone` from the gravest: `danger` to fix · `warning` to watch · `success` good news · `neutral` to know, asking nothing · `ok`); optionally `label` (`State`, its name), `okLabel` (`All good`), `footer` (a link to the page where they all are).

```tsx
<AppShell … topBarChips={
  <StateSummary
    items={[
      { id: 'bank', tone: expired ? 'danger' : 'ok', icon: <KeyRound />, label: expired ? 'Sign in again' : 'Bank connected', href: '/settings/bank' },
      { id: 'live', tone: live ? 'ok' : 'neutral', label: live ? 'Live updates' : 'Polling' },
    ]}
    footer={<TextLink to="/services" variant="quiet">Every service</TextLink>} />
} />
```

- In `AppShell`'s `topBarChips`, where several `StateChip`s would take the top bar's room. One state alone that applies now and then is still a `StateChip`.
- The pill takes the gravest tone (the `StateChip`'s washes); under 1280px its icon and how many stand out, from 1280px the gravest's words and "+N" (its words are longer than a StateChip's, which shows them from 1024px). `neutral` and `ok` stand out only once it is opened: grey or green dot, the neutral state's words or `okLabel` from 640px.
- Its button is named by what it says ("State: 1 to fix, 1 to watch", or the one state's words), for a screen reader.
- Opened (a `Popover`, in `document.body`), the states that stand out come first, the gravest first, then the quiet ones in grey; a state followed closes it, one opened in another tab leaves it open; Escape gives the focus back.
- `gravestTone(items)` says the gravest tone of a list, `ok` for none.
