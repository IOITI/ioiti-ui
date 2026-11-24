import { ActivityHeatmap } from 'ioiti-ui'

import { DELIVERIES_BY_DAY } from '../../../samples/charts'

export default function ActivityHeatmapCalendar() {
  return (
    <ActivityHeatmap
      aria-label="Deliveries made each day"
      data={DELIVERIES_BY_DAY}
      weeks={21}
      unit="deliveries"
    />
  )
}
