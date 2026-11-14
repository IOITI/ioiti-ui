import { AnimatedTabs } from 'ioiti-ui'

export default function AnimatedTabsViews() {
  return (
    <AnimatedTabs
      label="Orders by state"
      tabs={[
        { id: 'open', label: 'Open', badge: 3, content: <p>Three orders placed, not sent yet: the oldest waits since Monday.</p> },
        { id: 'late', label: 'Late', badge: 1, content: <p>One order is past the day it was promised for.</p> },
        { id: 'sent', label: 'Sent', content: <p>Sent this week: 38 orders, 36 delivered.</p> },
        { id: 'all', label: 'All', content: <p>Every order, the newest first.</p> },
      ]}
    />
  )
}
