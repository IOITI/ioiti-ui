import { ActivityHeatmap } from 'ioiti-ui'

import { DELIVERIES_BY_DAY } from '../../../samples/charts'

export default function ActivityHeatmapCalendar() {
  return (
    <ActivityHeatmap
      ariaLabel="Deliveries made each day"
      data={DELIVERIES_BY_DAY}
      weeks={21}
      weekStart={1}
      unit="deliveries"
    />
  )
}
