import { Button, Popover, Textarea } from 'ioiti-ui'
import { StickyNote } from 'lucide-react'
import { useState } from 'react'

export default function PopoverPlacement() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Popover label="Above" side="top" trigger={<Button size="sm" variant="outline">Above</Button>}>
          <p className="max-w-56 text-sm">Above its button, where the window has room; below it otherwise.</p>
        </Popover>
        <Popover label="On the right" side="right" align="center" trigger={<Button size="sm" variant="outline">On the right</Button>}>
          <p className="max-w-56 text-sm">Beside it, centred on it.</p>
        </Popover>
        <Popover label="A fixed width" width={320} trigger={<Button size="sm" variant="outline">320 px wide</Button>}>
          <p className="text-sm">Its width in pixels, whatever its content.</p>
        </Popover>
      </div>
      <div className="w-72">
        {/* As wide as its trigger, and opened or closed by the page too (open, onOpenChange). */}
        <Popover
          label="Note on the delivery"
          width="trigger"
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button variant="outline" fullWidth leftIcon={<StickyNote />}>
              {note ? 'Change the note' : 'Add a note'}
            </Button>
          }
        >
          {(close) => (
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                close()
              }}
            >
              <Textarea rows={3} aria-label="Note" placeholder="Leave it with the neighbour" value={note} onChange={(event) => setNote(event.target.value)} />
              <Button type="submit" size="sm">
                Save
              </Button>
            </form>
          )}
        </Popover>
      </div>
      <span className="text-sm text-muted-foreground">
        The note’s popover is {open ? 'open' : 'closed'}
        {note ? `; the note: “${note}”` : ''}.
      </span>
    </div>
  )
}
