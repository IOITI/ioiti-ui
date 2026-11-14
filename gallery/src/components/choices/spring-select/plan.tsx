import { SpringSelect } from 'ioiti-ui'
import { useState } from 'react'

const PLANS = [
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
  { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
]

export default function SpringSelectPlan() {
  const [plan, setPlan] = useState('team')
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <SpringSelect label="Plan" value={plan} onChange={setPlan} options={PLANS} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Plan: {PLANS.find((option) => option.value === plan)?.label}.
      </p>
    </div>
  )
}
