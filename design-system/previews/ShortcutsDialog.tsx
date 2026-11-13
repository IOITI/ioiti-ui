import { Button, Kbd, ShortcutsDialog, useShortcut } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

/** Shortcuts that go to other pages: listed by the dialog on ?, or from its button. */
function Shortcuts() {
  const [open, setOpen] = useState(false)
  // The frame has no pages to go to: what was heard is said under the button.
  const [heard, setHeard] = useState<string | null>(null)
  useShortcut('g f', () => setHeard('Go to the forms'), { description: 'Go to the forms', group: 'Navigation' })
  useShortcut('g c', () => setHeard('Go to the charts'), { description: 'Go to the charts', group: 'Navigation' })
  useShortcut('g d', () => setHeard('Go to the dashboard'), { description: 'Go to the dashboard', group: 'Navigation' })
  return (
    <div className="flex flex-col items-start gap-2 p-5">
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Keyboard shortcuts
        </Button>
        <span className="inline-flex items-center gap-2">
          or press <Kbd keys="?" />, then <Kbd keys="g f" /> for the forms
        </span>
        <ShortcutsDialog open={open} onOpenChange={setOpen} />
      </div>
      <p className="text-xs text-muted-foreground">
        {heard ? `Heard: ${heard}.` : 'The button, or ? once the card has the focus, opens the list of the shortcuts, by group.'}
      </p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Shortcuts />)
