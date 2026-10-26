import { CheckIcon, PageHeader, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'
import designCss from 'ioiti-ui/design.css?raw'
import themeCss from 'ioiti-ui/theme.css?raw'
import tokensCss from 'ioiti-ui/tokens.css?raw'

import { Rule } from '../parts'
import { contrastPairs, SURFACES, TEXTS, themeTokens } from '../tokens'
import type { ThemeName } from '../tokens'

// The stylesheets as the package ships them, in the order a page imports them.
const SHEETS = [tokensCss, themeCss, designCss]
const THEMES: Record<ThemeName, Record<string, string>> = {
  light: themeTokens(SHEETS, 'light'),
  dark: themeTokens(SHEETS, 'dark'),
}

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

function Sample({ theme, name, text }: { theme: ThemeName; name: string; text?: boolean }) {
  const tokens = THEMES[theme]
  const value = tokens[name] ?? ''
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-lg border border-border text-sm font-semibold"
        style={{ background: tokens['--background'], color: text ? value : undefined }}
      >
        {text ? 'Aa' : <span className="size-5 rounded-md border border-black/5" style={{ background: value }} />}
      </span>
      <code className="truncate font-mono text-[11px] text-muted-foreground">{value}</code>
    </div>
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
            {SURFACES.map((surface) => {
              const value = ratio(text, surface)
              return (
                <TableCell key={surface} numeric>
                  {value === undefined ? (
                    '—'
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      {value.toFixed(2)}
                      <CheckIcon state={value >= 4.5 ? 'pass' : 'fail'} />
                    </span>
                  )}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function Colours() {
  return (
    <>
      <PageHeader
        title="Colours"
        description="Two themes, each a full set of tokens. A component names a token, never a colour: it is right in both themes."
      />

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Two values for every colour">
            A class that names a colour has its dark value beside it (text-neutral-600 dark:text-neutral-400), or goes
            through a token that has both. A literal with one value shows in one theme only.
          </Rule>
          <Rule title="Checked, not judged by eye">
            Text is 4.5:1 at least on every surface of its theme, a hovered row included: the table below is computed from
            the stylesheets, and the package's tests hold it.
          </Rule>
          <Rule title="The page follows the system">
            Until a theme is chosen with the button, which is kept in the browser under the application's own key.
          </Rule>
          <Rule title="Charts read their colours once">
            A canvas takes the colours it read when it was made: give it the theme as its key, so that another theme makes
            another chart.
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
                    <Sample theme="light" name={token.name} text={group.text} />
                  </TableCell>
                  <TableCell>
                    <Sample theme="dark" name={token.name} text={group.text} />
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
    </>
  )
}
