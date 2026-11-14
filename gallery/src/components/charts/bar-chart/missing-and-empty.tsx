import { BarChart } from 'ioiti-ui'

// Wednesday was not counted: no bar, and a dash in the tooltip and the table.
const PARCELS = [
  { label: 'Mon', parcels: 182 },
  { label: 'Tue', parcels: 164 },
  { label: 'Wed', parcels: null },
  { label: 'Thu', parcels: 171 },
  { label: 'Fri', parcels: 205 },
]

export default function BarChartMissingAndEmpty() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="min-w-0 rounded-xl border border-dashed border-border p-3">
        <BarChart ariaLabel="Parcels sent this week" data={PARCELS} series={[{ key: 'parcels', label: 'Parcels' }]} height={180} integer />
      </div>
      <div className="min-w-0 rounded-xl border border-dashed border-border p-3">
        <BarChart ariaLabel="Parcels sent next week" data={[]} series={[{ key: 'parcels', label: 'Parcels' }]} height={180} />
      </div>
    </div>
  )
}
