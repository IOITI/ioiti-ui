import { ACCENTS, CodeBlock, PageHeader, Panel } from 'ioiti-ui'
import accentsCss from 'ioiti-ui/accents.css?raw'
import designCss from 'ioiti-ui/design.css?raw'
import glassCss from 'ioiti-ui/glass.css?raw'
import themeCss from 'ioiti-ui/theme.css?raw'
import tokensCss from 'ioiti-ui/tokens.css?raw'

import { Rule } from '../parts'
import { lookTokens, themeTokens, valueOf } from '../tokens'
import type { ThemeName } from '../tokens'

const SHEETS = [tokensCss, themeCss, accentsCss, glassCss, designCss]
const THEMES: Record<ThemeName, Record<string, string>> = { light: themeTokens(SHEETS, 'light'), dark: themeTokens(SHEETS, 'dark') }
const PRESETS = ACCENTS.filter((accent) => accent !== 'neutral')

const RAMPS: { title: string; description: string; tokens: string[] }[] = [
  {
    title: 'Series and axes',
    description: 'One series in the series blue; gains and losses in their pair; the grid and the axes recede.',
    tokens: ['--chart-series', '--chart-positive', '--chart-negative', '--chart-muted', '--chart-grid', '--chart-axis'],
  },
  {
    title: 'Things compared',
    description: 'Up to four lines on one chart, in this order and never recycled: every pair was checked for colour-blind readers, and a fifth colour has none that passes.',
    tokens: ['--chart-compare-1', '--chart-compare-2', '--chart-compare-3', '--chart-compare-4'],
  },
  {
    title: 'Gains and losses by size',
    description: 'A heatmap\'s two scales, the smallest step first. Teal, not emerald: emerald\'s and red\'s paler steps look alike to deuteranopes.',
    tokens: ['--chart-gain-1', '--chart-gain-2', '--chart-gain-3', '--chart-gain-4', '--chart-loss-1', '--chart-loss-2', '--chart-loss-3', '--chart-loss-4'],
  },
  {
    title: 'A sequence',
    description: 'The stages of a funnel: one hue, its lightness rising step by step. Only the last step may recede against the card.',
    tokens: ['--chart-funnel-1', '--chart-funnel-2', '--chart-funnel-3', '--chart-funnel-4', '--chart-funnel-5'],
  },
]

const CODE = ['--code-keyword', '--code-string', '--code-number', '--code-comment', '--code-function', '--code-namespace', '--code-type', '--code-builtin', '--code-operator']

function Ramp({ theme, tokens, values = THEMES[theme], label = theme }: { theme: ThemeName; tokens: string[]; values?: Record<string, string>; label?: string }) {
  return (
    <div className="rounded-xl border border-border p-3" style={{ background: values['--surface'] }}>
      <p className="mb-2 text-[11px] font-medium" style={{ color: values['--muted-foreground'] }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token) => (
          <div key={token} className="flex flex-col items-center gap-1">
            <span className="h-8 w-12 rounded-md" style={{ background: valueOf(values, token) }} />
            <code className="font-mono text-[10px]" style={{ color: values['--muted-foreground'] }}>
              {token.replace('--chart-', '')}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartColours() {
  return (
    <>
      <PageHeader title="Chart colours" description="Marks need a narrower band of lightness than text, and must stay apart for colour-blind readers: they have tokens of their own, one set per theme." />

      {RAMPS.map((ramp) => (
        <Panel key={ramp.title} title={ramp.title} description={ramp.description}>
          <div className="grid gap-3 md:grid-cols-2">
            <Ramp theme="light" tokens={ramp.tokens} />
            <Ramp theme="dark" tokens={ramp.tokens} />
          </div>
        </Panel>
      ))}

      <Panel
        title="In each accent"
        description="An accent sets the one series and the funnel's sequence in its own hue, the other sets stay: things compared and gains and losses keep their colours in every look. Blue keeps the design's own."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {PRESETS.flatMap((accent) =>
            (['light', 'dark'] as const).map((theme) => (
              <Ramp
                key={`${accent}-${theme}`}
                theme={theme}
                label={`${accent}, ${theme}`}
                values={lookTokens(SHEETS, { theme, accent, material: 'flat' })}
                tokens={['--chart-series', '--chart-funnel-1', '--chart-funnel-2', '--chart-funnel-3', '--chart-funnel-4', '--chart-funnel-5']}
              />
            )),
          )}
        </div>
      </Panel>

      <Panel title="Code" description="A code editor's highlighting: text colours, each 4.5:1 at least on its surface.">
        <CodeBlock
          language="ts"
          label="total.ts"
          code={`// What an order costs, with its tax
export function total(order: Order) {
  const rate = 1.2
  return Math.round(order.amount * rate) + ' with tax'
}`}
        />
        <p className="mt-3 text-xs text-muted-foreground">{CODE.join(' · ')}</p>
      </Panel>

      <Panel title="In a chart" description="Recharts (or any SVG) reads the tokens as CSS variables, and follows the theme by itself.">
        <CodeBlock language="tsx" code={`<Line dataKey="total" stroke="var(--chart-series)" dot={false} />
<CartesianGrid stroke="var(--chart-grid)" />
<XAxis stroke="var(--chart-axis)" tick={{ fill: 'var(--muted-foreground)' }} />`} />
      </Panel>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Text and marks are apart">
            A mark's colour is not a text's: --chart-positive fills a bar, --positive writes a figure.
          </Rule>
          <Rule title="Check a new pair">
            Before changing a pair, check it for colour-blind separation and lightness against the card of its theme.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
