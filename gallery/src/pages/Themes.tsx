import { ACCENTS, LookPicker, PageHeader, Panel, ThemeToggle, useTheme } from 'ioiti-ui'
import accentsCss from 'ioiti-ui/accents.css?raw'
import designCss from 'ioiti-ui/design.css?raw'
import glassCss from 'ioiti-ui/glass.css?raw'
import themeCss from 'ioiti-ui/theme.css?raw'
import tokensCss from 'ioiti-ui/tokens.css?raw'

import { Code, Demo, Rule } from '../parts'
import { lookTokens, valueOf } from '../tokens'

const SHEETS = [tokensCss, themeCss, accentsCss, glassCss, designCss]

/**
 * An accent as the stylesheets give it, drawn whatever the look shown: a filled button (its gradient where it
 * has one, without the grain, which is the page's), a chosen item, a link.
 */
function AccentPreview({ accent, theme }: { accent: string; theme: 'light' | 'dark' }) {
  const tokens = lookTokens(SHEETS, { theme, accent, material: 'flat' })
  const value = (name: string) => valueOf(tokens, name)
  const neutral = accent === 'neutral'
  const filled = value('--brand-gradient')
    ? { background: value('--brand-gradient'), color: value('--brand-fill-foreground') }
    : { background: value('--brand'), color: value('--brand-foreground') }
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border p-3" style={{ background: value('--surface'), color: value('--foreground') }}>
      <p className="text-[11px] font-medium" style={{ color: value('--muted-foreground') }}>
        {accent}, {theme}
      </p>
      <span
        className="inline-flex h-8 w-fit items-center rounded-lg px-3 text-xs font-medium"
        style={neutral ? { background: value('--text-primary'), color: value('--bg') } : filled}
      >
        Save
      </span>
      <span className="inline-flex h-8 items-center rounded-lg px-2.5 text-xs" style={neutral ? { background: value('--surface-hover') } : { background: value('--brand-soft'), color: value('--brand-text') }}>
        The page shown
      </span>
      <span className="text-xs underline underline-offset-2" style={{ color: neutral ? undefined : value('--brand-text') }}>
        A link
      </span>
    </div>
  )
}

export function Themes() {
  const { theme, accent, material } = useTheme()
  return (
    <>
      <PageHeader
        title="Themes"
        description="Three choices, each with the others: light or dark, an accent, a material. Neutral and flat are the design as it was."
      />

      <Panel title="Shown now" description="Every page of the gallery, with every component, in what is chosen here or with the palette button of the top bar.">
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

      <Panel
        title="The accents"
        description="Neutral is ink, as the design was. A preset puts its colour on what is chosen, current or primary, on links, the focus ring and one-series charts; the tones of gain, loss and warning keep theirs, which is why no preset's colour is green, red, amber, orange or teal. Bloom is a flyer's grainy gradient: its orchid on all of these, the gradient itself on a filled button and the application's mark, and under glass the flyer as the backdrop; its tangerine and mustard are never a mark's."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ACCENTS.flatMap((preset) => (['light', 'dark'] as const).map((mode) => <AccentPreview key={`${preset}-${mode}`} accent={preset} theme={mode} />))}
        </div>
      </Panel>

      <Panel
        title="The glass material"
        description="Translucent surfaces over a still backdrop of colour washes, a light across each and the colour around it in its far corner, deeper shadows. Fields, rows and buttons stay solid."
      >
        <ul className="grid gap-4 sm:grid-cols-3">
          <Rule title="glass-bar">The sidebar and the top bar: translucent over the backdrop, a light on their edge.</Rule>
          <Rule title="glass-card">Panels, tiles and cards: the same, with a hairline and a soft shadow.</Rule>
          <Rule title="glass-float">
            What floats over the page, and the only glass blurred: popovers, menus, dialogs over a lighter scrim, toasts,
            tooltips, the drawer.
          </Rule>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Asked for less transparency or more contrast, the browser gets opaque surfaces and no blur.
        </p>
      </Panel>

      <Panel title="The application's own" description="Given to the Vite plugin, written on the page before its first paint; a person's choice wins over it.">
        <Code>{`// vite.config.ts
ioiti({ themeStorageKey: 'my-app.theme', accent: 'violet', material: 'glass' })

// The top bar, with the picker beside the theme's button (without it, every person sees the application's)
<AppShell menu={MENU} pathname={pathname} topBarEnd={<><LookPicker /><ThemeToggle /></>}>`}</Code>
      </Panel>

      <Panel title="In a component" description="The rules that keep every look right, and the design as it was.">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="The accent after the neutral classes">
            What is chosen, current or primary keeps its classes and adds the accent's after them:
            bg-neutral-900 dark:bg-white accent:bg-brand accent:text-brand-foreground. A filled, primary control
            takes the accent's gradient too, where it has one: accent:bg-(image:--brand-fill)
            accent:text-brand-fill-foreground. Neutral changes nothing.
          </Rule>
          <Rule title="A surface's material by its role">
            glass-bar, glass-card or glass-float after the surface's own classes; they do nothing until the material
            is glass.
          </Rule>
          <Rule title="No blur over a fixed child">
            A blur makes an element the containing block of its fixed children, and the end of the blur of what floats
            inside it: glass-float on what holds neither, never on a white text on ink.
          </Rule>
          <Rule title="Every look, checked">
            The gallery's tests hold text at 4.5:1 and marks at 3:1 on every surface of the 20 looks, glass over its
            backdrop's strongest colours, a grain at its strongest speck; a look's tokens are in its own file, in
            blocks of one selector.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
