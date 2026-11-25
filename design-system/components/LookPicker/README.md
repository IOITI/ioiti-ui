# LookPicker

The accent and the material, each person's own: a button beside the theme's that opens the choices, a choice shown at once and kept in this browser.

**You provide** its place, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`, and `className`; nothing else. The accents are `neutral` · `violet` · `indigo` · `blue` · `bloom` · `lagoon` · `aurora` · `dusk` · `golden` (Golden hour), the materials `flat` · `glass`; until one is chosen, the page shows the application's (`ioiti({ accent, material })` in the Vite config).

```tsx
<AppShell menu={MENU} pathname={pathname} topBarEnd={<><LookPicker /><ThemeToggle /></>}>
  …
</AppShell>
```

- It reads and sets the theme's context (`useTheme()`), which `IoitiProvider` holds and writes on `<html>` (`data-accent`, `data-material`). Outside it, the choices do nothing.
- The choices are a layer in `document.body`, under the button; a click elsewhere closes them.
- The panel floats: `surface`, `border`, `radius-xl`, `shadow-elevated`; `glass-float` under glass. A chosen option is `surface-raised`, its edge `brand` under an accent.
- In the menu of the account instead: `UserMenu`'s `appearance`.

## Accessibility

Its button is named by what is shown ("Accent and material: violet, glass") and says whether its choices are open; its hint says what it is for. The choices are two groups of the browser's own radios, Accent and Material, each named by its legend; a choice shows at once.

| Key | What it does |
|---|---|
| Enter, Space | On its button: opens the choices, the focus on the accent shown |
| ←, →, ↑, ↓ | In a group: the next choice or the one before, shown at once |
| Tab, Shift+Tab | From the accents to the materials; past their ends, closes the choices, the focus back on the button |
| Escape | Closes them, the focus back on the button |
