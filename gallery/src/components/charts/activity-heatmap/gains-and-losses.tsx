import { ActivityHeatmap, formatMoney } from 'ioiti-ui'

import { MARGIN_BY_DAY } from '../../../samples/charts'

// Gains in teal, losses in red, each in four steps from the smallest.
const GAIN_LOSS = {
  positive: ['var(--chart-gain-1)', 'var(--chart-gain-2)', 'var(--chart-gain-3)', 'var(--chart-gain-4)'],
  negative: ['var(--chart-loss-1)', 'var(--chart-loss-2)', 'var(--chart-loss-3)', 'var(--chart-loss-4)'],
}

const total = MARGIN_BY_DAY.reduce((sum, day) => sum + day.value, 0)

export default function ActivityHeatmapGainsAndLosses() {
  return (
    <ActivityHeatmap
      ariaLabel="Margin of each working day"
      data={MARGIN_BY_DAY}
      startDate={MARGIN_BY_DAY[0]?.date}
      weeks={21}
      weekStart={1}
      diverging={GAIN_LOSS}
      format={(value) => formatMoney(value, 'EUR', true)}
      summary={`${formatMoney(total, 'EUR', true)} over ${MARGIN_BY_DAY.length} days`}
      legend={['Loss', 'Gain']}
    />
  )
}
