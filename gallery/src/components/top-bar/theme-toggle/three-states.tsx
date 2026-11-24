import { ThemeToggle, themeButtonLabel, useMessages, useTheme } from 'ioiti-ui'

export default function ThemeToggleThreeStates() {
  // The application's theme (IoitiProvider): this gallery's own, which a press changes.
  const { preference, theme } = useTheme()
  // What the button says, in the application's language.
  const { look } = useMessages()
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ThemeToggle />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {themeButtonLabel(preference, theme, look)}
      </p>
    </div>
  )
}
