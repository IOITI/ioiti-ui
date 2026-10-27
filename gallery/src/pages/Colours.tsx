import { ACCENTS, CheckIcon, MATERIALS, PageHeader, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, useTheme } from 'ioiti-ui'
import accentsCss from 'ioiti-ui/accents.css?raw'
import designCss from 'ioiti-ui/design.css?raw'
import glassCss from 'ioiti-ui/glass.css?raw'
import themeCss from 'ioiti-ui/theme.css?raw'
import tokensCss from 'ioiti-ui/tokens.css?raw'

import { Rule } from '../parts'
import { contrastPairs, lookPairs, lookTokens, SURFACES, TEXTS, themeTokens, valueOf } from '../tokens'
import type { Look, ThemeName } from '../tokens'

// The stylesheets as the package ships them, in the order a page imports them.
const SHEETS = [tokensCss, themeCss, accentsCss, glassCss, designCss]
const THEMES: Record<ThemeName, Record<string, string>> = {
  light: themeTokens(SHEETS, 'light'),
  dark: themeTokens(SHEETS, 'dark'),
}
const PRESETS = ACCENTS.filter((accent) => accent !== 'neutral')
const LOOKS: Look[] = (['light', 'dark'] as const).flatMap((theme) =>
  ACCENTS.flatMap((accent) => MATERIALS.map((material) => ({ theme, accent, material }))),
)

interface Token {
  name: string
  /** The Tailwind classes that use it. */
  utility: string
  use: string
}

const GROUPS: { title: string; description: string; text?: boolean; tokens: Token[] }[] = [
  {
    title: 'Page and surfaces',
    description: 'The page is one step off white in light, near black in dark; what stands on it is a surface.',
    tokens: [
      { name: '--background', utility: 'bg-background', use: 'The page.' },
      { name: '--surface', utility: 'bg-surface', use: 'Fields and cards. A panel is it at 50 % over the page (25 % in dark).' },
      { name: '--surface-raised', utility: 'bg-surface-raised', use: 'What stands on a surface: an icon tile, a code line, a table\'s head.' },
      { name: '--surface-hover', utility: 'bg-surface-hover', use: 'A row or a control under the pointer.' },
      { name: '--muted', utility: 'bg-muted', use: 'A quiet fill: a progress track, a placeholder.' },
      { name: '--primary', utility: 'bg-primary', use: 'A filled control, and the text it carries (--primary-foreground).' },
    ],
  },
  {
    title: 'Borders',
    description: 'Borders mark an object apart; dividers inside it are the same colour, fainter (border-border/40).',
    tokens: [
      { name: '--border', utility: 'border-border', use: 'Panels, tables, fields. Panels take it at 70 %.' },
      { name: '--border-hover', utility: 'border-border-hover', use: 'A control under the pointer.' },
      { name: '--border-subtle', utility: 'border-border-subtle', use: 'A line that should barely show.' },
      { name: '--input', utility: 'border-input', use: 'Inputs drawn by the design system\'s own fields.' },
    ],
  },
  {
    title: 'Text',
    description: 'Every text colour reads at 4.5:1 at least on every surface of its theme (below).',
    text: true,
    tokens: [
      { name: '--foreground', utility: 'text-foreground', use: 'Headings and figures.' },
      { name: '--text-secondary', utility: 'text-text-secondary', use: 'Labels of fields.' },
      { name: '--muted-foreground', utility: 'text-muted-foreground', use: 'Descriptions, captions, a table\'s head.' },
      { name: '--text-muted', utility: 'text-text-muted', use: 'Placeholders.' },
      { name: '--text-subtle', utility: 'text-text-subtle', use: 'What matters least: a unit, a separator.' },
    ],
  },
  {
    title: 'Status',
    description: 'Status as text, at 4.5:1. Never alone: a word, a sign or an icon says it too.',
    text: true,
    tokens: [
      { name: '--positive', utility: 'text-positive', use: 'A gain, a success, up.' },
      { name: '--negative', utility: 'text-negative', use: 'A loss, an error, down.' },
      { name: '--warning', utility: 'text-warning', use: 'Something to look at.' },
      { name: '--info', utility: 'text-info', use: 'A neutral note.' },
      { name: '--focus-ring', utility: ':focus-visible', use: 'The keyboard\'s focus, the same everywhere.' },
    ],
  },
]

const BRAND: Token[] = [
  { name: '--brand', utility: 'accent:bg-brand', use: 'A filled control, a box checked, a switch on, a progress, the day picked.' },
  { name: '--brand-foreground', utility: 'accent:text-brand-foreground', use: 'Text and icons on the fill.' },
  { name: '--brand-soft', utility: 'accent:bg-brand-soft', use: 'The tint of what is chosen: the page in the menu, a row, an option, a range.' },
  { name: '--brand-text', utility: 'accent:text-brand-text', use: 'The accent as text: a link, the tab and the step shown.' },
  {
    name: '--brand-gradient',
    utility: 'accent:bg-(image:--brand-fill)',
    use: 'A filled button and the application\'s mark, under the grain, where the accent has one (bloom); its text is --brand-fill-foreground.',
  },
]

const GLASS: Token[] = [
  { name: '--glass-base', utility: 'body', use: 'The page under the washes.' },
  { name: '--glass-tint-1', utility: 'body', use: 'The washes of the backdrop, at their strongest (an accent\'s in place of each it gives: the first, or all three).' },
  { name: '--glass-tint-2', utility: 'body', use: '' },
  { name: '--glass-tint-3', utility: 'body', use: '' },
  { name: '--glass-bar', utility: 'glass-bar', use: 'The sidebar and the top bar.' },
  { name: '--glass-card', utility: 'glass-card', use: 'Panels, tiles, cards.' },
  { name: '--glass-float', utility: 'glass-float', use: 'What floats, blurred: popovers, menus, dialogs, toasts, tooltips.' },
  { name: '--glass-shine', utility: 'glass-*', use: 'The light across a glass surface, from its top corner.' },
  { name: '--glass-reflection', utility: 'glass-*', use: 'The colour around it, in its far corner (the accent\'s).' },
  { name: '--glass-scrim', utility: 'glass:', use: 'Under a dialog: lighter than the design\'s.' },
]

function Sample({ tokens, name, text }: { tokens: Record<string, string>; name: string; text?: boolean }) {
  // Its references followed here: on the page, a var() would take the look shown, not this one.
  const value = valueOf(tokens, name) ?? ''
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-sm font-semibold"
        style={{ background: valueOf(tokens, '--glass-base') ?? valueOf(tokens, '--background'), color: text ? value : undefined }}
      >
        {text ? 'Aa' : <span className="size-5 rounded-md border border-black/5" style={{ background: value }} />}
      </span>
      <code className="truncate font-mono text-[11px] text-muted-foreground">{value}</code>
    </div>
  )
}

function Ratio({ value, minimum = 4.5 }: { value?: number; minimum?: number }) {
  if (value === undefined) return <>—</>
  return (
    <span className="inline-flex items-center gap-1">
      {value.toFixed(2)}
      <CheckIcon state={value >= minimum ? 'pass' : 'fail'} />
    </span>
  )
}

function ContrastTable({ theme }: { theme: ThemeName }) {
  const pairs = contrastPairs(THEMES[theme])
  const ratio = (text: string, surface: string) => pairs.find((pair) => pair.text === text && pair.surface === surface)?.ratio
  return (
    <Table density="dense" aria-label={`Contrast of text, ${theme} theme`}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Text on</TableHeaderCell>
          {SURFACES.map((surface) => (
            <TableHeaderCell key={surface} numeric>
              {surface}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {TEXTS.map((text) => (
          <TableRow key={text}>
            <TableHeaderCell className="font-mono text-xs">{text}</TableHeaderCell>
            {SURFACES.map((surface) => (
              <TableCell key={surface} numeric>
                <Ratio value={ratio(text, surface)} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** The look shown: every text and mark on every surface it has, glass at its worst over the backdrop. */
function LookContrast({ look }: { look: Look }) {
  const pairs = lookPairs(lookTokens(SHEETS, look), look)
  const surfaces = [...new Set(pairs.map((pair) => pair.surface))].filter(
    (surface) => !surface.startsWith('--brand-soft on') && surface !== '--brand' && surface !== '--brand-gradient',
  )
  const texts = [...new Set(pairs.filter((pair) => surfaces.includes(pair.surface)).map((pair) => pair.text))]
  return (
    <Table density="dense" aria-label={`Contrast of text and marks, ${look.theme}, ${look.accent}, ${look.material}`} className="min-w-[56rem]">
      <TableHead>
        <TableRow>
          <TableHeaderCell>On</TableHeaderCell>
          {surfaces.map((surface) => (
            <TableHeaderCell key={surface} numeric>
              {surface.replace(' on --glass-scrim', ' on scrim')}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {texts.map((text) => (
          <TableRow key={text}>
            <TableHeaderCell className="font-mono text-xs">{text}</TableHeaderCell>
            {surfaces.map((surface) => {
              const pair = pairs.find((found) => found.text === text && found.surface === surface)
              return (
                <TableCell key={surface} numeric>
                  <Ratio value={pair?.ratio} minimum={pair?.minimum} />
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Every look, at its weakest: the lowest text and mark of each. */
function EveryLook() {
  return (
    <Table density="dense" aria-label="The weakest pair of every look">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Look</TableHeaderCell>
          <TableHeaderCell>Weakest text</TableHeaderCell>
          <TableHeaderCell numeric>Ratio</TableHeaderCell>
          <TableHeaderCell>Weakest mark</TableHeaderCell>
          <TableHeaderCell numeric>Ratio</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {LOOKS.map((look) => {
          const pairs = lookPairs(lookTokens(SHEETS, look), look)
          // None where the stylesheets are not read (the gallery's tests import them empty).
          const weakest = (minimum: number) =>
            pairs.filter((pair) => pair.minimum === minimum).reduce<(typeof pairs)[number] | undefined>((low, pair) => (!low || pair.ratio < low.ratio ? pair : low), undefined)
          const text = weakest(4.5)
          const mark = weakest(3)
          return (
            <TableRow key={`${look.theme}-${look.accent}-${look.material}`}>
              <TableCell>{`${look.theme}, ${look.accent}, ${look.material}`}</TableCell>
              <TableCell className="font-mono text-xs">{text ? `${text.text} on ${text.surface}` : '—'}</TableCell>
              <TableCell numeric>
                <Ratio value={text?.ratio} />
              </TableCell>
              <TableCell className="font-mono text-xs">{mark ? `${mark.text} on ${mark.surface}` : '—'}</TableCell>
              <TableCell numeric>
                <Ratio value={mark?.ratio} minimum={3} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function Colours() {
  const { theme, accent, material } = useTheme()
  return (
    <>
      <PageHeader
        title="Colours"
        description="Two themes, each a full set of tokens; an accent and a material set some of them again (Themes). A component names a token, never a colour: it is right in every look."
      />

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Two values for every colour">
            A class that names a colour has its dark value beside it (text-neutral-600 dark:text-neutral-400), or goes
            through a token that has both. A literal with one value shows in one theme only.
          </Rule>
          <Rule title="Checked, not judged by eye">
            Text is 4.5:1 at least, and a mark 3:1, on every surface of every look, a hovered row and glass over its
            backdrop's strongest colours included: the tables below are computed from the stylesheets, and the package's
            tests hold them.
          </Rule>
          <Rule title="The page follows the system">
            Until a theme is chosen with the button, which is kept in the browser under the application's own key; the
            accent and the material beside it, the application's own until a person picks another.
          </Rule>
          <Rule title="Charts read their colours once">
            A canvas takes the colours it read when it was made: give it the theme and the accent as its key, so that
            another theme or accent makes another chart.
          </Rule>
        </ul>
      </Panel>

      {GROUPS.map((group) => (
        <Panel key={group.title} title={group.title} description={group.description} dense>
          <Table aria-label={group.title} className="min-w-[44rem]">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Token</TableHeaderCell>
                <TableHeaderCell>Light</TableHeaderCell>
                <TableHeaderCell>Dark</TableHeaderCell>
                <TableHeaderCell>Used as</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.tokens.map((token) => (
                <TableRow key={token.name}>
                  <TableCell>
                    <code className="font-mono text-xs text-foreground">{token.name}</code>
                    <p className="mt-0.5 text-muted-foreground">{token.use}</p>
                  </TableCell>
                  <TableCell>
                    <Sample tokens={THEMES.light} name={token.name} text={group.text} />
                  </TableCell>
                  <TableCell>
                    <Sample tokens={THEMES.dark} name={token.name} text={group.text} />
                  </TableCell>
                  <TableCell>
                    <code className="font-mono text-xs">{token.utility}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      ))}

      <Panel
        title="Accents"
        description="What is chosen, current or primary, in a preset's colour: a fill and the text on it, a tint, the accent as text. Each preset sets the focus ring and the one-series charts too (accents.css)."
        dense
      >
        <Table aria-label="Accents" className="min-w-[60rem]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Token</TableHeaderCell>
              {PRESETS.flatMap((preset) =>
                (['light', 'dark'] as const).map((mode) => <TableHeaderCell key={`${preset}-${mode}`}>{`${preset}, ${mode}`}</TableHeaderCell>),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {BRAND.map((token) => (
              <TableRow key={token.name}>
                <TableCell>
                  <code className="font-mono text-xs text-foreground">{token.name}</code>
                  <p className="mt-0.5 text-muted-foreground">{token.use}</p>
                  <code className="font-mono text-[11px] text-muted-foreground">{token.utility}</code>
                </TableCell>
                {PRESETS.flatMap((preset) =>
                  (['light', 'dark'] as const).map((mode) => (
                    <TableCell key={`${preset}-${mode}`}>
                      <Sample tokens={lookTokens(SHEETS, { theme: mode, accent: preset, material: 'flat' })} name={token.name} text={token.name === '--brand-text'} />
                    </TableCell>
                  )),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Glass" description="The glass material's backdrop and surfaces, and the light on them (glass.css)." dense>
        <Table aria-label="Glass" className="min-w-[44rem]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Token</TableHeaderCell>
              <TableHeaderCell>Light</TableHeaderCell>
              <TableHeaderCell>Dark</TableHeaderCell>
              <TableHeaderCell>Used by</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {GLASS.map((token) => (
              <TableRow key={token.name}>
                <TableCell>
                  <code className="font-mono text-xs text-foreground">{token.name}</code>
                  {token.use && <p className="mt-0.5 text-muted-foreground">{token.use}</p>}
                </TableCell>
                {(['light', 'dark'] as const).map((mode) => (
                  <TableCell key={mode}>
                    <Sample tokens={lookTokens(SHEETS, { theme: mode, accent: 'neutral', material: 'glass' })} name={token.name} />
                  </TableCell>
                ))}
                <TableCell>
                  <code className="font-mono text-xs">{token.utility}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      {(['light', 'dark'] as const).map((theme) => (
        <Panel
          key={theme}
          title={`Text on every surface, ${theme}`}
          description={
            theme === 'dark'
              ? 'One pair is under 4.5:1, as it was in the interface these colours come from: --text-subtle on a hovered surface (4.44). Keep that colour for what matters least, off hovered rows.'
              : 'Contrast ratios of WCAG 2.'
          }
        >
          <ContrastTable theme={theme} />
        </Panel>
      ))}

      <Panel
        title={`The look shown: ${theme}, ${accent}, ${material}`}
        description="Text at 4.5:1 and marks (the accent's fill, the focus ring) at 3:1, each at its worst over what a surface can show: glass over the base and each wash at its strongest, with its light and reflection and the accent's grain, a dialog over its scrim. Choose another with the palette button."
        dense
      >
        <LookContrast look={{ theme, accent, material }} />
      </Panel>

      <Panel
        title="Every look"
        description="The weakest text and the weakest mark of each of the 20 looks, the text on an accent's gradient included. The design's one exception shows in the dark flat ones: --text-subtle on a hovered surface (4.44)."
        dense
      >
        <EveryLook />
      </Panel>
    </>
  )
}
