import { PromptComposer } from 'ioiti-ui'
import { useState } from 'react'

export default function PromptComposerFloating() {
  const [value, setValue] = useState('')
  // It floats at the foot of what scrolls under it, with no band behind it.
  return (
    <div className="relative h-72 overflow-y-auto rounded-2xl border border-border/70 px-4 pt-4">
      <div className="space-y-3 text-sm text-muted-foreground">
        {Array.from({ length: 9 }, (_, index) => (
          <p key={index}>
            Line {index + 1} of the conversation: what was asked, what the assistant did and what it answered, scrolling under the field that
            floats over it.
          </p>
        ))}
      </div>
      <div className="sticky bottom-3 mt-4">
        <PromptComposer label="Ask again" hideLabel value={value} onValueChange={setValue} onSubmit={() => setValue('')} placeholder="Ask again…" floating />
      </div>
    </div>
  )
}
