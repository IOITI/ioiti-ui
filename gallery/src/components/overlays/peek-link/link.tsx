import { PeekLink } from 'ioiti-ui'

function InvoicePreview() {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">Invoice 2026-0042</p>
      <p className="text-xs text-muted-foreground">Acme · due on 30 Oct</p>
      <p className="font-semibold tabular-nums">1,840.00 €</p>
    </div>
  )
}

export default function PeekLinkLink() {
  return (
    <p className="max-w-md text-sm">
      Acme paid{' '}
      <PeekLink to="/patterns/dashboard" content={() => <InvoicePreview />} className="font-medium underline underline-offset-2">
        invoice 2026-0042
      </PeekLink>{' '}
      on Tuesday, four days before it was due.
    </p>
  )
}
