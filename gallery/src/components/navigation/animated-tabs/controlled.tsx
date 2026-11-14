import { AnimatedTabs, Button } from 'ioiti-ui'
import { AlertTriangle, Inbox, Send } from 'lucide-react'
import { useState } from 'react'

const TABS = [
  { id: 'open', label: 'Open', icon: <Inbox className="size-3.5" />, badge: 3 },
  { id: 'late', label: 'Late', icon: <AlertTriangle className="size-3.5" />, badge: 1 },
  { id: 'sent', label: 'Sent', icon: <Send className="size-3.5" /> },
]

export default function AnimatedTabsControlled() {
  const [tab, setTab] = useState('open')
  const shown = TABS.find((each) => each.id === tab)
  return (
    <div className="flex flex-col items-start gap-4">
      <AnimatedTabs label="Orders by state" renderContent={false} tabs={TABS} activeTab={tab} onChange={setTab} />
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setTab('late')} disabled={tab === 'late'}>
          Show the late order
        </Button>
        <span className="text-sm text-muted-foreground">
          Shown: <span className="font-medium text-foreground">{shown?.label}</span>
        </span>
      </div>
    </div>
  )
}
