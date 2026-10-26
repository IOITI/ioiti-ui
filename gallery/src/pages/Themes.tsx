import { LookPicker, PageHeader, Panel, ThemeToggle, useTheme } from 'ioiti-ui'

import { Code, Demo } from '../parts'

export function Themes() {
  const { theme, accent, material } = useTheme()
  return (
    <>
      <PageHeader
        title="Themes"
        description="Three choices, each of the others: light or dark, an accent, a material. Neutral and flat are the design as it was."
      />

      <Panel title="Shown now" description="Every page of the gallery, with every component, in what is chosen here.">
        <p className="text-sm">
          <span className="font-medium">{theme}</span>, the <span className="font-medium">{accent}</span> accent, the{' '}
          <span className="font-medium">{material}</span> material.
        </p>
      </Panel>

      <Demo
        id="look-picker"
        title="The accent and material picker"
        description="Beside the theme's button. A choice shows at once and is kept in the browser, under the application's key; until one is made, the page shows the application's."
        names={['LookPicker']}
      >
        <LookPicker />
        <ThemeToggle />
      </Demo>

      <Panel title="The application's own" description="Given to the Vite plugin, written on the page before its first paint.">
        <Code>{`// vite.config.ts
ioiti({ themeStorageKey: 'my-app.theme', accent: 'violet', material: 'glass' })

// The top bar, with the picker beside the theme's button
<AppShell menu={MENU} pathname={pathname} topBarEnd={<><LookPicker /><ThemeToggle /></>}>`}</Code>
      </Panel>
    </>
  )
}
