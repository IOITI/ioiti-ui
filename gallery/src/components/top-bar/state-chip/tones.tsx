import { StateChip } from 'ioiti-ui'
import { BadgeCheck, KeyRound, RotateCw } from 'lucide-react'

export default function StateChipTones() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StateChip
        to="/patterns/settings"
        tone="warning"
        icon={<RotateCw className="size-3.5" aria-hidden />}
        label="Restart needed"
        hint="The services run an older configuration."
      />
      <StateChip
        to="/patterns/sign-in"
        tone="danger"
        icon={<KeyRound className="size-3.5" aria-hidden />}
        label="Sign in again"
        hint="The connection to the bank expired: nothing is sent until it is renewed."
      />
      <StateChip
        to="/components/tables"
        tone="success"
        icon={<BadgeCheck className="size-3.5" aria-hidden />}
        label="Approved"
        hint="The refund was approved: it can be sent."
      />
    </div>
  )
}
