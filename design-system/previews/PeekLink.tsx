import { PeekCard, PeekLink } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

function InvoicePreview() {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">Invoice 2026-0042</p>
      <p className="text-xs text-muted-foreground">Acme · due on 30 Oct</p>
      <p className="font-semibold tabular-nums">1,840.00 €</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex min-h-[13rem] flex-col items-start gap-3 p-5">
    <div className="flex flex-wrap items-center gap-4">
      <PeekLink to="#invoice-2026-0042" content={() => <InvoicePreview />} className="text-sm font-medium underline underline-offset-2">
        Invoice 2026-0042
      </PeekLink>
      <PeekCard renderContent={() => <InvoicePreview />} href="#invoice-2026-0042">
        <button type="button" className="rounded-full border border-border px-2.5 py-0.5 text-xs">
          1,840.00 €
        </button>
      </PeekCard>
    </div>
    <span className="text-xs text-muted-foreground">Hover or focus one: a card shows where it leads. A click, or a second tap, follows it.</span>
  </div>,
)
