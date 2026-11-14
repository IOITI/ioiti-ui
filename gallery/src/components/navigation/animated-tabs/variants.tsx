import { AnimatedTabs } from 'ioiti-ui'

const PERIODS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

export default function AnimatedTabsVariants() {
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">default</p>
        <AnimatedTabs label="Period" renderContent={false} tabs={PERIODS} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">pill</p>
        <AnimatedTabs variant="pill" label="Period" renderContent={false} tabs={PERIODS} defaultTab="week" />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">glass</p>
        <AnimatedTabs variant="glass" label="Period" renderContent={false} tabs={PERIODS} defaultTab="month" />
      </div>
    </div>
  )
}
