import { ActivityHeatmap } from 'ioiti-ui'

import { ORDERS_BY_HOUR } from '../../../samples/charts'

export default function ActivityHeatmapWeekdayByHour() {
  return (
    <ActivityHeatmap
      ariaLabel="Orders by weekday and hour"
      mode="hours"
      matrix={ORDERS_BY_HOUR}
      rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
      hours={[9, 10, 11, 12, 13, 14, 15, 16, 17]}
      unit="orders"
      // The hour the shop is shut is no hour of zero orders.
      emptyText="Closed"
    />
  )
}
