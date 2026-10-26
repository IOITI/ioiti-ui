import { PageHeader, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

import { Rule } from '../parts'

const SCALE = [
  { name: 'Page title', classes: 'text-2xl tracking-tight', weight: '700 (h1)', sample: 'Orders', note: 'PageHeader. One a page.' },
  { name: 'Sign-in title', classes: 'text-xl font-semibold tracking-tight', weight: '600', sample: 'My App', note: 'AuthLayout.' },
  { name: 'Figure', classes: 'text-xl font-semibold tracking-tight sm:text-2xl', weight: '600', sample: '12,480.00 €', note: 'A tile\'s figure: proportional digits at this size.' },
  { name: 'Section title', classes: 'text-sm font-semibold', weight: '600 (h2)', sample: 'Latest orders', note: 'A panel\'s title.' },
  { name: 'Body', classes: 'text-sm', weight: '400', sample: 'The order was sent to the warehouse.', note: 'Running text, descriptions.' },
  { name: 'Small', classes: 'text-xs text-muted-foreground', weight: '400', sample: 'Updated 2 min ago', note: 'Captions, a table\'s head, a tile\'s label.' },
  { name: 'Field label', classes: 'text-xs text-text-secondary', weight: '400', sample: 'Customer', note: 'Field.' },
  { name: 'Code', classes: 'font-mono text-xs', weight: '400', sample: 'IT-1042', note: 'Ids, keys, what is typed exactly.' },
]

const TRACKING = [
  { token: '--tracking-tighter', value: '-0.04em' },
  { token: '--tracking-tight-heading', value: '-0.035em', use: 'h1' },
  { token: '--tracking-snug', value: '-0.02em', use: 'h3' },
  { token: '--tracking-body', value: '-0.011em', use: 'the body' },
]

export function Typography() {
  return (
    <>
      <PageHeader title="Type" description="Geist for everything read, JetBrains Mono for what is typed exactly. A few sizes, used the same way on every page." />

      <Panel title="The two faces" description="Variable fonts, served with the application's own files (a strict Content-Security-Policy allows nothing else).">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Geist Variable · font-sans</p>
            <p className="text-3xl font-semibold tracking-tight">Aa Bb Cc 0123</p>
            <p className="text-sm">The quick brown fox jumps over the lazy dog. 1,234.56 € +12.4 % −3.5 %</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">JetBrains Mono Variable · font-mono</p>
            <p className="font-mono text-3xl">Aa {'{}'} 0Oo1lI</p>
            <p className="font-mono text-sm">const total = items.reduce((sum, item) =&gt; sum + item.amount, 0)</p>
          </div>
        </div>
      </Panel>

      <Panel title="Sizes" description="Tailwind's sizes, as the components use them." dense>
        <Table aria-label="Sizes" className="min-w-[44rem]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Use</TableHeaderCell>
              <TableHeaderCell>Sample</TableHeaderCell>
              <TableHeaderCell>Classes</TableHeaderCell>
              <TableHeaderCell>Weight</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SCALE.map((row) => (
              <TableRow key={row.name}>
                <TableCell>
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-muted-foreground">{row.note}</p>
                </TableCell>
                <TableCell>
                  <span className={row.classes}>{row.sample}</span>
                </TableCell>
                <TableCell>
                  <code className="font-mono">{row.classes}</code>
                </TableCell>
                <TableCell>{row.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Rules">
        <ul className="grid gap-4 sm:grid-cols-2">
          <Rule title="Figures that line up have one width">
            In a column, a table or a list of amounts, tabular-nums makes every digit as wide as another. A tile's large
            figure keeps proportional digits: tabular ones look loose at that size.
          </Rule>
          <Rule title="Signed, with a true minus">
            A change says its sign (+12.4 %, −3.5 %), with the minus sign (−), not a hyphen: formatMoney and formatPercent
            write them so.
          </Rule>
          <Rule title="Tight headings">
            Headings are set a little tighter than the text ({TRACKING.map((item) => `${item.token} ${item.value}`).join(', ')}).
          </Rule>
          <Rule title="Nothing under 11 px">
            The smallest text is a badge's 11 px; descriptions and labels are 12 px (text-xs).
          </Rule>
        </ul>
      </Panel>
    </>
  )
}
