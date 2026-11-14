import { Badge, PeekCard } from 'ioiti-ui'

function CustomerPreview() {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">Acme</p>
      <p className="text-xs text-muted-foreground">A customer since 2021: 14 orders, 18,420.00 €.</p>
    </div>
  )
}

export default function PeekLinkCard() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Any element that takes the focus: it keeps its own focus and click. */}
      <PeekCard renderContent={() => <CustomerPreview />} href="/patterns/dashboard" hrefLabel="Open the customer">
        <button type="button" className="rounded-full border border-border px-2.5 py-0.5 text-xs">
          Acme
        </button>
      </PeekCard>
      <PeekCard renderContent={() => <CustomerPreview />} placement="bottom" delay={0}>
        <button type="button" className="rounded-full border border-border px-2.5 py-0.5 text-xs">
          Below, at once
        </button>
      </PeekCard>
      <PeekCard renderContent={() => <CustomerPreview />} placement="top" openOnTap={false}>
        <button type="button" className="rounded-full" aria-label="Acme, paid">
          <Badge tone="success" dot>
            Paid
          </Badge>
        </button>
      </PeekCard>
    </div>
  )
}
