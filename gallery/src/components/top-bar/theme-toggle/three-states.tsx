import { ThemeToggle, themeLabel, useTheme } from 'ioiti-ui'

export default function ThemeToggleThreeStates() {
  // The application's theme (IoitiProvider): this gallery's own, which a press changes.
  const { preference, theme } = useTheme()
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ThemeToggle />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {themeLabel(preference, theme)}
      </p>
    </div>
  )
}
