# ThemeToggle

One button for the theme in three states, follow the system, light, dark: its icon is the state it is in, its label says that and what a press does.

**You provide** its place and `className`; nothing else. `AppShell`'s top bar draws it by default, `AuthLayout` in its corner; beside `LookPicker`, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`.

```tsx
<ThemeToggle />
```

- A press goes from the system's to light, to dark, and back to the system's; the whole page changes in one cross-fade. While it follows the system, a change of the system setting is followed at once.
- The choice is kept in this browser under the application's key (`IoitiProvider`'s `themeStorageKey`). It reads the theme's context (`useTheme()`) from `IoitiProvider`, which writes the theme on `<html>` (the `dark` class); outside it, it shows dark and a press does nothing.
- Its label is the state and the next one: "Theme: follows the system (dark now). Press for always light."
