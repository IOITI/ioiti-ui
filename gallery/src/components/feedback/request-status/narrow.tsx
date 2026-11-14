import { RequestStatus } from 'ioiti-ui'

export default function RequestStatusNarrow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="max-w-72">
        <RequestStatus
          status="verifying"
          title="Sent to the carrier"
          description="Waiting for its tracking number."
          subject="Delivery · 3 parcels to a very long address in Saint-Rémy-de-Provence"
        />
      </div>
      <div className="max-w-72">
        <RequestStatus
          status="unknown"
          title="No news from the bank"
          description="No answer for 2 min: the payment may still go through. Look at the account before paying again."
          reference={{ label: 'Payment', value: 'PY-55102' }}
        />
      </div>
    </div>
  )
}
