import { ACCENT_LABEL, DescriptionList, MATERIAL_LABEL, SegmentedControl, ThemeToggle, themeLabel, useTheme } from 'ioiti-ui'
import type { SegmentedControlOption, ThemePreference } from 'ioiti-ui'
import { Monitor, Moon, Sun } from 'lucide-react'

const PREFERENCES: SegmentedControlOption<ThemePreference>[] = [
  { value: 'system', label: 'System', icon: <Monitor /> },
  { value: 'light', label: 'Light', icon: <Sun /> },
  { value: 'dark', label: 'Dark', icon: <Moon /> },
]

export default function IoitiProviderTheme() {
  // The application's, held by IoitiProvider: every component below it reads it, and sets it.
  const { preference, theme, setPreference, accent, material } = useTheme()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl label="Theme" size="sm" options={PREFERENCES} value={preference} onChange={setPreference} />
        <ThemeToggle />
      </div>
      <DescriptionList
        className="max-w-lg"
        compressed
        items={[
          { term: 'Chosen', details: preference },
          { term: 'Shown', details: theme },
          { term: 'Accent', details: ACCENT_LABEL[accent] },
          { term: 'Material', details: MATERIAL_LABEL[material] },
          { term: 'The theme button says', details: themeLabel(preference, theme) },
        ]}
      />
    </div>
  )
}
