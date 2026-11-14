import { Kbd } from 'ioiti-ui'

export default function KbdSequences() {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="inline-flex items-center gap-2">
          Go to the orders <Kbd keys="g o" />
        </span>
        <span className="inline-flex items-center gap-2">
          Go to the invoices <Kbd keys="g i" />
        </span>
        <span className="inline-flex items-center gap-2">
          Go home <Kbd keys="g h" />
        </span>
      </div>
      {/* In a sentence, it sits on the line. */}
      <p className="max-w-prose">
        Press <Kbd keys="g o" /> anywhere to go to the orders, then <Kbd keys="mod+k" /> to find one by its reference.
      </p>
    </div>
  )
}
