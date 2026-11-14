import { ChartLegend } from 'ioiti-ui'

export default function ChartLegendShapes() {
  return (
    <div className="flex flex-col gap-6">
      {/* Each swatch drawn as the chart draws its series, in the chart's own tokens. */}
      <ChartLegend
        label="Revenue"
        items={[
          { label: 'North street', color: 'var(--chart-compare-1)', shape: 'line', value: '+4.2%' },
          { label: 'Harbour', color: 'var(--chart-compare-2)', shape: 'line', value: '+1.8%' },
          { label: 'Last year', color: 'var(--chart-muted)', shape: 'dashed', value: '+0.9%' },
          { label: 'Orders', color: 'var(--chart-compare-3)', shape: 'dot' },
          { label: 'Release', color: 'var(--chart-axis)', shape: 'marker' },
        ]}
      />
      {/* Bars and areas: squares, the default. */}
      <ChartLegend
        label="Orders by channel"
        items={[
          { label: 'Shop', color: 'var(--chart-compare-1)', value: '2,630' },
          { label: 'Phone', color: 'var(--chart-compare-2)', value: '1,010' },
          { label: 'Partners', color: 'var(--chart-compare-3)', value: '830' },
        ]}
      />
    </div>
  )
}
