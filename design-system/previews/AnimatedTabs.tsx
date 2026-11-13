import { AnimatedTabs } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-4 p-5">
    <AnimatedTabs
      label="Orders by state"
      tabs={[
        { id: 'open', label: 'Open', badge: 3, content: <p className="pt-3 text-sm text-muted-foreground">Three open orders.</p> },
        { id: 'sent', label: 'Sent', content: <p className="pt-3 text-sm text-muted-foreground">Sent this week.</p> },
        { id: 'all', label: 'All', content: <p className="pt-3 text-sm text-muted-foreground">Every order.</p> },
      ]}
      renderContent
    />
    <AnimatedTabs variant="pill" label="Period" tabs={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }]} />
  </div>,
)
