import { ScrollProgressNav } from 'ioiti-ui'
import { useRef } from 'react'

const PARTS = [
  { id: 'setup-account', label: 'Account', text: 'Create the workspace, name it, and invite the people who work in it: each receives an email with a link.' },
  { id: 'setup-catalogue', label: 'Catalogue', text: 'Import the products from a file or from the shop’s address; the first import takes a few minutes.' },
  { id: 'setup-payments', label: 'Payments', text: 'Connect the bank account the payments are made to, then choose the cards accepted.' },
  { id: 'setup-delivery', label: 'Delivery', text: 'Choose the carriers, their prices by weight, and the day an order leaves when it is placed after noon.' },
]

export default function ScrollProgressNavInline() {
  const frame = useRef<HTMLDivElement>(null)
  return (
    <div className="space-y-3">
      <ScrollProgressNav label="The setup guide" mode="inline" containerRef={frame} sections={PARTS} />
      <div ref={frame} className="h-64 overflow-y-auto rounded-xl border border-border/70 px-4 pb-4">
        {PARTS.map((part, index) => (
          <section key={part.id} id={part.id} className="scroll-mt-3 pt-4 pb-2 last:min-h-44">
            <h3 className="text-sm font-semibold">
              {index + 1}. {part.label}
            </h3>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">{part.text}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
