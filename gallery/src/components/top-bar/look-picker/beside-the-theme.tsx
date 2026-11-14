import { LookPicker, ThemeToggle } from 'ioiti-ui'

export default function LookPickerBesideTheTheme() {
  return (
    // AppShell's topBarEnd={<><LookPicker /><ThemeToggle /></>}
    <div className="flex items-center gap-2">
      <LookPicker />
      <ThemeToggle />
    </div>
  )
}
