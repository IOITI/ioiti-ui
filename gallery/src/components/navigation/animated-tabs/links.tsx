import { AnimatedTabs } from 'ioiti-ui'
import { useState } from 'react'

const VIEWS = [
  { id: 'summary', label: 'Summary', href: '?view=summary' },
  { id: 'lines', label: 'Lines', badge: 4, href: '?view=lines' },
  { id: 'history', label: 'History', href: '?view=history' },
]

const SAID: Record<string, string> = {
  summary: 'Order 2026-0042: 4 lines, 1,840.00 €, paid by card.',
  lines: 'Four lines: two boxes of paper, a stapler, a box of pens.',
  history: 'Placed on 26 Oct at 09:12, paid a minute later, being packed.',
}

export default function AnimatedTabsLinks() {
  // The view the address names, when it names one: a tab opened with ⌘ or Ctrl shows it.
  const [view, setView] = useState(() => {
    const named = new URLSearchParams(window.location.search).get('view')
    return VIEWS.find((each) => each.id === named)?.id ?? 'summary'
  })
  return (
    <div className="space-y-3">
      <AnimatedTabs label="Views of the order" renderContent={false} tabs={VIEWS} activeTab={view} onChange={setView} />
      <p className="text-sm text-muted-foreground">{SAID[view]}</p>
    </div>
  )
}
