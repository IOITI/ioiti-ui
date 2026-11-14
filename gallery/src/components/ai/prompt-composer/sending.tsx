import { PromptComposer } from 'ioiti-ui'
import { useState } from 'react'

export default function PromptComposerSending() {
  const [value, setValue] = useState('Which orders of October were late?')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<string[]>([])
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="min-w-0 space-y-3">
        {/* busy and no onStop: nothing can be sent, or stopped, until the answer has come. */}
        <PromptComposer
          label="Ask about the orders"
          value={value}
          onValueChange={setValue}
          busy={sending}
          onSubmit={(text) => {
            setSent([...sent, text])
            setSending(true)
            setValue('')
            window.setTimeout(() => setSending(false), 2000)
          }}
          minRows={1}
        />
        <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
          {sent.length === 0 ? <li className="list-none">Nothing sent yet: press Enter.</li> : sent.map((text, index) => <li key={index}>{text}</li>)}
        </ol>
      </div>
      {/* Nothing can be sent at all: why, on the button's hint. */}
      <PromptComposer
        label="Ask about the invoices"
        value=""
        onValueChange={() => {}}
        onSubmit={() => {}}
        disabled
        disabledReason="The assistant is switched off for this workspace"
        placeholder="Ask about an invoice…"
        minRows={1}
      />
    </div>
  )
}
