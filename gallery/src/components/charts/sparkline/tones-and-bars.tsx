import { Sparkline } from 'ioiti-ui'

const ROWS = [
  { said: 'Up: its last value above its first', values: [12, 14, 13, 17, 16, 19, 22] },
  { said: 'Down', values: [22, 20, 21, 17, 18, 15, 13] },
  { said: 'No direction (neutral)', values: [8, 9, 8, 9, 8, 9, 8], tone: 'neutral' as const },
  { said: 'Down, where down is good (positive)', values: [9, 8, 8, 7, 6, 6, 5], tone: 'positive' as const },
]

export default function SparklineTonesAndBars() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <ul className="space-y-3 text-sm">
        {ROWS.map((row) => (
          <li key={row.said} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{row.said}</span>
            <Sparkline label={row.said} values={row.values} tone={row.tone} />
          </li>
        ))}
      </ul>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Bars: a gain up, a loss down</span>
          <Sparkline label="Result by day" variant="bars" values={[3, 5, -2, 4, -4, 6, 2, -1, 5]} width={120} height={32} />
        </li>
        <li className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Bars, all of one tone</span>
          <Sparkline label="Sign-ups by day" variant="bars" tone="neutral" values={[3, 5, 2, 4, 4, 6, 2, 1, 5]} width={120} height={32} />
        </li>
        <li className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Larger, at a figure’s side</span>
          <Sparkline label="Visits per day" values={[310, 290, 340, 360, 330, 390, 420, 410, 450]} width={160} height={40} />
        </li>
      </ul>
    </div>
  )
}
