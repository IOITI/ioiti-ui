import { LineChart } from 'ioiti-ui'

const WEEK = [
  { t: '2026-10-19', returns: 6 },
  { t: '2026-10-20', returns: 9 },
  { t: '2026-10-21', returns: 5 },
  { t: '2026-10-22', returns: 11 },
  { t: '2026-10-23', returns: 7 },
  { t: '2026-10-24', returns: 4 },
  { t: '2026-10-25', returns: 3 },
]

export default function LineChartNarrowAndEmpty() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="min-w-0 max-w-xs rounded-xl border border-dashed border-border p-3">
        <LineChart ariaLabel="Returns this week" data={WEEK} series={[{ key: 'returns', label: 'Returns' }]} area zero height={160} />
      </div>
      <div className="min-w-0 max-w-xs rounded-xl border border-dashed border-border p-3">
        <LineChart ariaLabel="Returns next week" data={[]} series={[{ key: 'returns', label: 'Returns' }]} height={160} />
      </div>
    </div>
  )
}
