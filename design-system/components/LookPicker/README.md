# LookPicker

The accent and the material, each person's own: a button beside the theme's that opens the choices, a choice shown at once and kept in this browser.

**You provide** its place, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`, and `className`; nothing else. The accents are `neutral` · `violet` · `indigo` · `blue` · `bloom`, the materials `flat` · `glass`; until one is chosen, the page shows the application's (`ioiti({ accent, material })` in the Vite config).

```tsx
<AppShell menu={MENU} pathname={pathname} topBarEnd={<><LookPicker /><ThemeToggle /></>}>
  …
</AppShell>
```

- It reads and sets the theme's context (`useTheme()`), which `IoitiProvider` holds and writes on `<html>` (`data-accent`, `data-material`). Outside it, the choices do nothing.
- The choices are a layer in `document.body`, under the button: the focus goes into them (the accent shown), and Escape, a click elsewhere or a Tab past their ends close them, the button taking the focus again. Its hint says what it is for, its name what is shown ("Accent and material: violet, glass").
- The panel floats: `surface`, `border`, `radius-xl`, `shadow-elevated`; `glass-float` under glass. A chosen option is `surface-raised`, its edge `brand` under an accent.
- In the menu of the account instead: `UserMenu`'s `appearance`.
