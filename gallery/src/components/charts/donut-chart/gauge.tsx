import { DonutChart } from 'ioiti-ui'

export default function DonutChartGauge() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <DonutChart
        ariaLabel="Storage used"
        variant="semi"
        centerLabel="Used"
        showLegend={false}
        formatValue={(value) => `${Math.round(value)} GB`}
        data={[
          { label: 'Used', value: 312 },
          // The rest of the limit: grey, as what is not counted.
          { label: 'Free', value: 188, color: 'var(--chart-muted)' },
        ]}
      />
      <DonutChart
        ariaLabel="Seats taken"
        variant="semi"
        centerLabel="Seats taken"
        showLegend={false}
        data={[
          { label: 'Taken', value: 46 },
          { label: 'Free', value: 4, color: 'var(--chart-muted)' },
        ]}
      />
    </div>
  )
}
