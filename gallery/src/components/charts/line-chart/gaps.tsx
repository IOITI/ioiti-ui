import { LineChart } from 'ioiti-ui'

// Two couriers' share of parcels on time, each measured on the days it delivered: null where it did not.
const ON_TIME = [
  { t: '2026-10-05', north: 94, coast: null },
  { t: '2026-10-06', north: 91, coast: 88 },
  { t: '2026-10-07', north: null, coast: 90 },
  { t: '2026-10-08', north: 95, coast: null },
  { t: '2026-10-09', north: 93, coast: 86 },
  { t: '2026-10-12', north: null, coast: 89 },
  { t: '2026-10-13', north: 96, coast: 92 },
  { t: '2026-10-14', north: 92, coast: null },
  { t: '2026-10-15', north: null, coast: 91 },
  { t: '2026-10-16', north: 97, coast: 93 },
]

const SERIES = [
  { key: 'north', label: 'North couriers' },
  { key: 'coast', label: 'Coast couriers' },
]

const percent = (value: number) => `${Math.round(value)}%`

export default function LineChartGaps() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="min-w-0 space-y-2">
        <p className="text-sm font-medium">A gap where nothing was measured</p>
        <LineChart ariaLabel="Parcels on time, gaps kept" data={ON_TIME} series={SERIES} height={200} formatValue={percent} />
      </div>
      <div className="min-w-0 space-y-2">
        <p className="text-sm font-medium">Joined across: each on its own days</p>
        <LineChart ariaLabel="Parcels on time, gaps joined" data={ON_TIME} series={SERIES} height={200} formatValue={percent} connectGaps />
      </div>
    </div>
  )
}
