import { Breadcrumb, StateChip, Switch, ThemeToggle } from 'ioiti-ui'
import { RotateCw } from 'lucide-react'
import { useState } from 'react'

export default function StateChipInTheTopBar() {
  const [needsRestart, setNeedsRestart] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      {/* As AppShell lays it out: the trail takes the room left, the chips after it, the end last. */}
      <div className="flex h-14 w-full items-center gap-3 rounded-xl border border-border px-4 glass-bar">
        <div className="flex min-w-0 flex-1 items-center">
          <Breadcrumb wrap={false} items={[{ label: 'Home', href: '/' }, { label: 'Settings', href: '/patterns/settings' }, { label: 'Services' }]} />
        </div>
        <div className="flex shrink-0 items-center gap-2 empty:hidden">
          {needsRestart && (
            <StateChip
              to="/patterns/settings"
              tone="warning"
              icon={<RotateCw className="size-3.5" aria-hidden />}
              label="Restart needed"
              hint="The services run an older configuration: restart them from the settings."
            />
          )}
        </div>
        <ThemeToggle />
      </div>
      <Switch label="The services need a restart" checked={needsRestart} onChange={setNeedsRestart} />
    </div>
  )
}
