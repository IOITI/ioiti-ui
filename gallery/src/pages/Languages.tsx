import {
  Calendar,
  CodeBlock,
  formattersFor,
  PageHeader,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  useLocale,
} from 'ioiti-ui'
import type { Formatters } from 'ioiti-ui'
import { fr } from 'ioiti-ui/locales/fr'

import { Demo, Rule } from '../parts'

// One moment, for every column: the page says the same thing at every visit.
const NOW = Date.parse('2026-10-11T12:00:00Z')

/** What each format writes, and an example of it. */
const SAMPLES: { name: string; write: (format: Formatters) => string }[] = [
  { name: 'formatMoney(-1234.5)', write: (format) => format.formatMoney(-1234.5) },
  { name: 'formatMoney(42.1, "EUR", true)', write: (format) => format.formatMoney(42.1, 'EUR', true) },
  { name: 'formatMoneyCompact(2_400_000)', write: (format) => format.formatMoneyCompact(2_400_000) },
  { name: 'formatPercent(12.4)', write: (format) => format.formatPercent(12.4) },
  { name: 'formatNumber(1234.5, 1)', write: (format) => format.formatNumber(1234.5, 1) },
  {
    name: 'formatDateTime(…, "Europe/Paris")',
    write: (format) => format.formatDateTime('2026-10-11T20:52:12Z', 'Europe/Paris', true, new Date(NOW)),
  },
  { name: 'formatDay("2026-10-01")', write: (format) => format.formatDay('2026-10-01') },
  { name: 'formatRelative(18 min before)', write: (format) => format.formatRelative('2026-10-11T11:42:00Z', NOW) },
  { name: 'formatDuration(4 days)', write: (format) => format.formatDuration(4 * 24 * 3_600_000) },
  { name: 'formatWait(3400)', write: (format) => format.formatWait(3400) },
  { name: 'formatBytes(48_200)', write: (format) => format.formatBytes(48_200) },
]

const COLUMNS = [
  { heading: 'en-GB, English', format: formattersFor('en-GB') },
  { heading: 'en-US, English', format: formattersFor('en-US') },
  { heading: 'fr-FR, French', format: formattersFor('fr-FR', { messages: fr }) },
]

const PROVIDER = `import { fr } from 'ioiti-ui/locales/fr'

// index.html: <html lang="fr">, the language a screen reader reads the page in.
<IoitiProvider locale="fr-FR" messages={fr}>
  <RouterProvider router={router} />
</IoitiProvider>`

const OWN_WORDS = `// Some words of the application's own, over the language's: namespace by namespace.
const words = mergeMessages(fr, { format: { past: (duration: string) => \`il y a \${duration} environ\` } })

<IoitiProvider locale="fr-FR" messages={words}>

// Or one component's, by its own prop, which wins over both.
<DatePicker placeholder="Date de livraison" />`

const HOOKS = `import { useFormat, useLocale, useMessages } from 'ioiti-ui'

function Balance({ amount }: { amount: number }) {
  // The formats of the provider's locale, in its words: the functions the package exports, in English, by name.
  const { formatMoney } = useFormat()
  // Its locale, the day its weeks start on, its clock.
  const { locale, weekStartsOn, hourCycle } = useLocale()
  return <span lang={locale}>{formatMoney(amount)}</span>
}`

const TYPED = `import { parseLocaleNumber } from 'ioiti-ui'

parseLocaleNumber('1 234,5', 'fr-FR') // 1234.5
parseLocaleNumber('1234.5', 'fr-FR') // 1234.5: a point, as people type it
parseLocaleNumber('1,500', 'en-GB') // 1500: a separator between groups of three
parseLocaleNumber('1,5', 'en-GB') // 1.5`

/** The locale of the gallery's components, as the language picker of the top bar sets it. */
function Current() {
  const { locale, weekStartsOn, hourCycle } = useLocale()
  // 1 November 2026 is a Sunday (day 0): the day `weekStartsOn` names is that many days after it.
  const day = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2026, 10, 1 + weekStartsOn))
  return (
    <p className="text-sm text-muted-foreground">
      The components of this gallery speak <span className="font-medium text-foreground">{locale}</span> now: their weeks
      start on <span className="font-medium text-foreground">{day}</span>, their clock counts{' '}
      <span className="font-medium text-foreground">{hourCycle === 'h12' ? '12 hours' : '24 hours'}</span>. The language
      picker of the top bar changes them; the gallery's own words stay English.
    </p>
  )
}

export function LanguagesAndFormats() {
  return (
    <>
      <PageHeader
        title="Languages and formats"
        description="A locale writes the numbers, amounts and dates, and starts the weeks; its catalogue says the words. English as Britain writes it by default, French beside it, an application's own words over either."
      />

      <Demo
        id="provider"
        title="A locale and its words"
        description="IoitiProvider takes the locale (a BCP 47 tag) and the catalogue of its language: give both, and the page's lang. Every component then writes and speaks in them."
        names={['IoitiProvider']}
        className="flex flex-col gap-4"
      >
        <Current />
        <CodeBlock language="tsx" copyable={false} code={PROVIDER} />
      </Demo>

      <Panel
        id="formats"
        title="The formats, in three locales"
        description="What the package's formats write for the same values: separators, the sign's place, the months, the clock, the units. The functions exported alone write English as Britain does; useFormat() gives the provider's."
        className="scroll-mt-20"
      >
        <Table aria-label="The formats in three locales" density="compact">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Format</TableHeaderCell>
              {COLUMNS.map((column) => (
                <TableHeaderCell key={column.heading}>{column.heading}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {SAMPLES.map((sample) => (
              <TableRow key={sample.name}>
                <TableCell className="font-mono text-xs">{sample.name}</TableCell>
                {COLUMNS.map((column) => (
                  <TableCell key={column.heading} className="tabular-nums">
                    {sample.write(column.format)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Demo
        id="weeks"
        title="The week and the clock"
        description="A calendar starts its weeks on the locale's day: Monday in Britain and France, Sunday in the United States. weekStartsOn on IoitiProvider, or on a calendar, says otherwise; hourCycle does for the clock."
        names={['Calendar']}
        className="grid gap-6 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">locale="en-US" weekStartsOn={'{0}'}</p>
          <Calendar locale="en-US" weekStartsOn={0} defaultMonth={new Date(2026, 9, 1)} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">locale="fr-FR" weekStartsOn={'{1}'}</p>
          <Calendar locale="fr-FR" weekStartsOn={1} defaultMonth={new Date(2026, 9, 1)} />
        </div>
      </Demo>

      <Panel id="own-words" title="Words of the application's own" description="Over the language's, namespace by namespace; a component's prop over both." className="scroll-mt-20">
        <CodeBlock language="tsx" copyable={false} code={OWN_WORDS} />
      </Panel>

      <Panel id="hooks" title="In a component of the application's own" description="The same formats and the same words as the package's components." className="scroll-mt-20">
        <CodeBlock language="tsx" copyable={false} code={HOOKS} />
      </Panel>

      <Panel id="typed" title="A number typed" description="Read as the locale writes it, and as people type it whatever their locale (NumberInput reads it so)." className="scroll-mt-20">
        <CodeBlock language="ts" copyable={false} code={TYPED} />
      </Panel>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="A locale with its words">
            The locale writes, the catalogue speaks: a French locale with English words reads half in one language. Give
            both, and the page's lang, which a screen reader reads the page with.
          </Rule>
          <Rule title="The closest word wins">
            A component's own prop (a placeholder, a title), then the application's words (messages), then the language's,
            then English's.
          </Rule>
          <Rule title="A language is an entry of its own">
            ioiti-ui/locales/fr is imported by an application that speaks French: one that does not bundles none of it.
          </Rule>
          <Rule title="The data keeps its time zone">
            The locale changes how a moment is written, never which moment: the formats take the time zone of the data
            (formatDateTime's timeZone).
          </Rule>
          <Rule title="A word added, in every language">
            A word the package says is added to English's catalogue and to French's in the same change: the catalogue's
            tests fail on a word French lacks, and the strings check on a word written in a component.
          </Rule>
          <Rule title="Formats, not text">
            A number, an amount, a percentage or a moment is written by the formats, never by hand ("12%", toFixed): only
            they know where a locale puts its sign, its separators and its space before %.
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
