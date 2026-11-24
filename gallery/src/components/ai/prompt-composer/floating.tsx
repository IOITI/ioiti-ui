import { PromptComposer } from 'ioiti-ui'

export default function PromptComposerFloating() {
  // It floats at the foot of what scrolls under it, with no band behind it. Its text its own: emptied once sent.
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
        <PromptComposer label="Ask again" hideLabel onSubmit={() => {}} placeholder="Ask again…" floating />
      </div>
    </div>
  )
}
