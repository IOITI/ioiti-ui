import { Tabs } from 'ioiti-ui'

const PERIODS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

export default function TabsVariants() {
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">default</p>
        <Tabs label="Period" renderContent={false} tabs={PERIODS} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">pill</p>
        <Tabs variant="pill" label="Period" renderContent={false} tabs={PERIODS} defaultValue="week" />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">glass</p>
        <Tabs variant="glass" label="Period" renderContent={false} tabs={PERIODS} defaultValue="month" />
      </div>
    </div>
  )
}
