import { RequestStatus, SegmentedControl } from 'ioiti-ui'
import type { RequestLifecycleStatus } from 'ioiti-ui'
import { useState } from 'react'

const STEPS: { status: RequestLifecycleStatus; title: string; description: string }[] = [
  { status: 'processing', title: 'Asked', description: 'The refund is on its way to the bank.' },
  { status: 'verifying', title: 'Sent, waiting for the answer', description: 'The bank has it; it usually answers within a minute.' },
  { status: 'success', title: 'Refunded', description: 'The customer gets 42.00 € back in two to three days.' },
  { status: 'failed', title: 'Refused', description: 'The bank refused it: the card has expired.' },
  { status: 'unknown', title: 'No news', description: 'No answer for 75 s: look at the order before asking again.' },
]

export default function RequestStatusStages() {
  const [status, setStatus] = useState<RequestLifecycleStatus>('processing')
  const step = STEPS.find((each) => each.status === status) ?? STEPS[0]
  return (
    <div className="max-w-md space-y-3">
      <SegmentedControl
        label="State of the request"
        size="sm"
        value={status}
        onChange={setStatus}
        options={STEPS.map((each) => ({ value: each.status, label: each.status }))}
      />
      <RequestStatus
        status={step.status}
        title={step.title}
        description={step.description}
        subject="Refund · order 2026-0042"
        figures={step.status === 'success' ? [{ label: 'Amount', value: '42.00 €' }, { label: 'Card', value: '•••• 4242' }] : undefined}
        reference={{ label: 'Refund', value: 'RF-88213' }}
        link={{ href: '/patterns/dashboard', label: 'See the order' }}
      />
    </div>
  )
}
