import { Button, ProductTour } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

// The parts of a page the tour walks through.
const PARTS = [
  { id: 'popover', title: 'A popover', body: 'Filters, a few settings.' },
  { id: 'menu', title: 'Menus', body: 'The actions on a thing.' },
  { id: 'dialog', title: 'Dialogs', body: 'What asks for a decision.' },
]

function Preview() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-[20rem] flex-col items-stretch gap-4 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Take the tour of this page
        </Button>
        <span className="text-xs text-muted-foreground">Press it: the page dims around each part in turn. The arrows move, Escape ends it.</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {PARTS.map((part) => (
          <div key={part.id} id={part.id} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-medium">{part.title}</p>
            <p className="text-xs text-muted-foreground">{part.body}</p>
          </div>
        ))}
      </div>
      <ProductTour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { title: 'What floats over the page', body: 'Three of the layers this page shows, one after the other. The arrows move from one to the next, Escape ends it.' },
          { target: '#popover', title: 'A popover', body: 'A panel beside its button: filters, a few settings.', placement: 'bottom' },
          { target: '#menu', title: 'Menus', body: 'The actions on a thing, behind a button or at the pointer.', placement: 'bottom' },
          { target: '#dialog', title: 'Dialogs', body: 'What asks for a decision, the page waiting behind it.', placement: 'top' },
          { title: 'That is the tour', body: 'Each step can lead anywhere on a page: an element, or a ref to it.' },
        ]}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
