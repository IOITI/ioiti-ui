import { StateChip } from 'ioiti-ui'
import { BadgeCheck, KeyRound, RotateCw } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-3 p-5">
    <div className="flex flex-wrap items-center gap-3">
      <StateChip
        to="#restart"
        tone="warning"
        icon={<RotateCw className="size-3.5" aria-hidden />}
        label="Restart needed"
        hint="The services run an older configuration."
      />
      <StateChip
        to="#sign-in-again"
        tone="danger"
        icon={<KeyRound className="size-3.5" aria-hidden />}
        label="Sign in again"
        hint="The connection to the bank expired: nothing is sent until it is renewed."
      />
      <StateChip
        to="#approved"
        tone="success"
        icon={<BadgeCheck className="size-3.5" aria-hidden />}
        label="Approved"
        hint="The refund was approved: it can be sent."
      />
    </div>
    <p className="text-xs text-muted-foreground">
      Under 1024 px the icon alone shows, its words its name: hover or focus a chip for what it means.
    </p>
  </div>,
)
