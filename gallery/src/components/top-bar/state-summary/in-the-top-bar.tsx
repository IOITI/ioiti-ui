import { Breadcrumb, StateSummary, Switch, TextLink, ThemeToggle } from 'ioiti-ui'
import type { StateItem } from 'ioiti-ui'
import { KeyRound, RotateCw, Server } from 'lucide-react'
import { useState } from 'react'

export default function StateSummaryInTheTopBar() {
  const [expired, setExpired] = useState(true)
  const [restart, setRestart] = useState(true)
  const [live, setLive] = useState(true)
  const items: StateItem[] = [
    expired
      ? { id: 'bank', tone: 'danger', icon: <KeyRound />, label: 'Sign in again', detail: 'The connection to the bank expired: nothing is sent until it is renewed.', href: '/patterns/sign-in' }
      : { id: 'bank', tone: 'ok', label: 'Bank connected', href: '/patterns/sign-in' },
    { id: 'services', tone: 'ok', icon: <Server />, label: 'All services up', href: '/patterns/settings' },
    ...(restart
      ? [{ id: 'restart', tone: 'warning' as const, icon: <RotateCw />, label: 'Restart needed', detail: 'The services run an older configuration.', href: '/patterns/settings' }]
      : []),
    live
      ? { id: 'live', tone: 'ok', label: 'Live updates' }
      : { id: 'live', tone: 'neutral', label: 'Polling', detail: 'Not receiving live updates: the page refreshes on a timer.' },
  ]
  return (
    <div className="flex flex-col gap-4">
      {/* As AppShell lays it out: the trail takes the room left, the states after it, the end last. */}
      <div className="flex h-14 w-full items-center gap-3 rounded-xl border border-border px-4 glass-bar">
        <div className="flex min-w-0 flex-1 items-center">
          <Breadcrumb wrap={false} items={[{ label: 'Home', href: '/' }, { label: 'Settings', href: '/patterns/settings' }, { label: 'Services' }]} />
        </div>
        <StateSummary items={items} footer={<TextLink href="/patterns/settings" variant="quiet">Every service</TextLink>} />
        <ThemeToggle />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Switch label="The bank's connection expired" checked={expired} onChange={setExpired} />
        <Switch label="The services need a restart" checked={restart} onChange={setRestart} />
        <Switch label="Live updates" checked={live} onChange={setLive} />
      </div>
    </div>
  )
}
