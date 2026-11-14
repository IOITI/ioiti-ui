import { Meter } from 'ioiti-ui'
import type { MeterTone } from 'ioiti-ui'

const QUOTAS: { label: string; figure: string; ratio: number; tone: MeterTone }[] = [
  { label: 'Seats taken', figure: '7 of 10', ratio: 0.7, tone: 'neutral' },
  { label: 'Error budget used', figure: '12%', ratio: 0.12, tone: 'positive' },
  { label: 'Storage used', figure: '45 of 50 GB', ratio: 0.9, tone: 'warning' },
  { label: 'Emails sent this month', figure: '10,000 of 10,000', ratio: 1, tone: 'negative' },
]

export default function MeterTones() {
  return (
    <ul className="grid max-w-md gap-5">
      {QUOTAS.map((quota) => (
        <li key={quota.label} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{quota.label}</span>
            <span className="tabular-nums">{quota.figure}</span>
          </div>
          <Meter ratio={quota.ratio} tone={quota.tone} label={quota.label} />
        </li>
      ))}
    </ul>
  )
}
