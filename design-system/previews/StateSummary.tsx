import { Breadcrumb, IconButton, StateSummary, Switch, TextLink } from 'ioiti-ui'
import type { StateItem } from 'ioiti-ui'
import { Bell, KeyRound, RotateCw, Server } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [expired, setExpired] = useState(true)
  const [restart, setRestart] = useState(true)
  const [live, setLive] = useState(true)
  const items: StateItem[] = [
    expired
      ? { id: 'bank', tone: 'danger', icon: <KeyRound />, label: 'Sign in again', detail: 'The connection to the bank expired: nothing is sent until it is renewed.', href: '#sign-in' }
      : { id: 'bank', tone: 'ok', label: 'Bank connected', href: '#sign-in' },
    { id: 'services', tone: 'ok', icon: <Server />, label: 'All services up', href: '#services' },
    ...(restart
      ? [{ id: 'restart', tone: 'warning' as const, icon: <RotateCw />, label: 'Restart needed', detail: 'The services run an older configuration.', href: '#services' }]
      : []),
    live
      ? { id: 'live', tone: 'ok', label: 'Live updates' }
      : { id: 'live', tone: 'neutral', label: 'Polling', detail: 'Not receiving live updates: the page refreshes on a timer.' },
  ]
  return (
    // Its panel opens under it, over the switches: the card keeps room for it.
    <div className="flex min-h-[20rem] flex-col gap-4 p-5">
      {/* As AppShell lays it out: the trail takes the room left, the states after it, the end last (a bell here: the
          theme's toggle needs a ThemeProvider, which the card's frame leaves to ThemeToggle's card). */}
      <div className="flex h-14 w-full items-center gap-3 rounded-xl border border-border px-4 glass-bar">
        <div className="flex min-w-0 flex-1 items-center">
          <Breadcrumb wrap={false} items={[{ label: 'Home', href: '#home' }, { label: 'Settings', href: '#settings' }, { label: 'Services' }]} />
        </div>
        <StateSummary items={items} footer={<TextLink href="#services" variant="quiet">Every service</TextLink>} />
        <IconButton label="Notifications" icon={<Bell />} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Switch label="The bank's connection expired" checked={expired} onChange={setExpired} />
        <Switch label="The services need a restart" checked={restart} onChange={setRestart} />
        <Switch label="Live updates" checked={live} onChange={setLive} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
