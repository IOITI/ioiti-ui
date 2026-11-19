import { StateSummary } from 'ioiti-ui'
import { BadgeCheck, RotateCw, TriangleAlert } from 'lucide-react'

export default function StateSummaryItsTones() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Something to fix: its words, and how many more. */}
      <StateSummary
        items={[
          { id: 'down', tone: 'danger', icon: <TriangleAlert />, label: 'Payments down', detail: 'No payment has gone through for 10 minutes.', href: '/patterns/settings' },
          { id: 'restart', tone: 'warning', icon: <RotateCw />, label: 'Restart needed', href: '/patterns/settings' },
        ]}
      />
      {/* Something to watch. */}
      <StateSummary items={[{ id: 'restart', tone: 'warning', icon: <RotateCw />, label: 'Restart needed', href: '/patterns/settings' }]} />
      {/* Good news not to miss. */}
      <StateSummary items={[{ id: 'approved', tone: 'success', icon: <BadgeCheck />, label: 'Approved', detail: 'The refund was approved: it can be sent.', href: '/components/tables' }]} />
      {/* Something to know that asks nothing: grey, in its words. */}
      <StateSummary items={[{ id: 'live', tone: 'neutral', label: 'Polling', detail: 'The page refreshes on a timer.' }]} />
      {/* All is well: a dot. */}
      <StateSummary items={[{ id: 'services', tone: 'ok', label: 'All services up', href: '/patterns/settings' }]} />
    </div>
  )
}
