import { DonutChart } from 'ioiti-ui'

export default function DonutChartSmallAndEmpty() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-56 rounded-2xl border border-border/70 bg-surface/50 p-4 dark:bg-surface/25">
        <p className="mb-2 text-sm font-medium">Tickets by state</p>
        <DonutChart
          ariaLabel="Tickets by state"
          centerLabel="Tickets"
          size={160}
          thickness={12}
          data={[
            { label: 'Open', value: 18 },
            { label: 'Waiting', value: 7 },
            { label: 'Solved', value: 64 },
          ]}
        />
      </div>
      <div className="w-56 rounded-2xl border border-border/70 bg-surface/50 p-4 dark:bg-surface/25">
        <p className="mb-2 text-sm font-medium">Refunds by reason</p>
        <DonutChart ariaLabel="Refunds by reason" centerLabel="Refunds" size={160} thickness={12} data={[]} />
      </div>
    </div>
  )
}
