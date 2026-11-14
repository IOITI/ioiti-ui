import { Button, PageHeader } from 'ioiti-ui'
import { Check, X } from 'lucide-react'

export default function PageHeaderLongTitle() {
  return (
    // As narrow as a phone's column.
    <div className="max-w-sm rounded-xl border border-border p-4">
      <PageHeader
        title="Refunds waiting for a second approval from the finance team"
        description="Each one above 500 € is checked by two people before it is sent back to the customer's card."
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<X />}>
              Refuse all
            </Button>
            <Button size="sm" leftIcon={<Check />}>
              Approve 12
            </Button>
          </>
        }
      />
    </div>
  )
}
