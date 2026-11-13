import { RequestStatus, SegmentedControl } from 'ioiti-ui'
import type { RequestLifecycleStatus } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const STEPS: { status: RequestLifecycleStatus; title: string; description: string }[] = [
  { status: 'processing', title: 'Asked', description: 'The refund is on its way to the bank.' },
  { status: 'verifying', title: 'Sent, waiting for the answer', description: 'The bank has it; it usually answers within a minute.' },
  { status: 'success', title: 'Refunded', description: 'The customer gets 42.00 € back in two to three days.' },
  { status: 'failed', title: 'Refused', description: 'The bank refused it: the card has expired.' },
  { status: 'unknown', title: 'No news', description: 'No answer for 75 s: look at the order before asking again.' },
]

function Preview() {
  // Shown done, its figures in: the card at its tallest.
  const [step, setStep] = useState(2)
  const current = STEPS[step]
  return (
    <div className="flex flex-col items-start gap-3 p-5">
      <SegmentedControl
        label="State of the request"
        size="sm"
        value={current.status}
        onChange={(status) => setStep(STEPS.findIndex((item) => item.status === status))}
        options={STEPS.map((item) => ({ value: item.status, label: item.status }))}
      />
      <RequestStatus
        className="max-w-md"
        status={current.status}
        title={current.title}
        description={current.description}
        subject="Refund · order 2026-0042"
        figures={current.status === 'success' ? [{ label: 'Amount', value: '42.00 €' }, { label: 'Card', value: '•••• 4242' }] : undefined}
        reference={{ label: 'Refund', value: 'RF-88213' }}
        link={{ href: '#order-2026-0042', label: 'See the order' }}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
