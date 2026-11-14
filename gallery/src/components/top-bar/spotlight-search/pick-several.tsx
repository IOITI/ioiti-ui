import { Button, SpotlightSearch } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { Building2, Paperclip, Receipt } from 'lucide-react'
import { useState } from 'react'

const THINGS: SpotlightSearchItem[] = [
  { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', icon: <Receipt /> },
  { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Globex · 960.50 €', icon: <Receipt /> },
  { id: 'c1', title: 'Acme', category: 'Customers', icon: <Building2 /> },
  { id: 'c2', title: 'Globex', category: 'Customers', icon: <Building2 /> },
]

export default function SpotlightSearchPickSeveral() {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string[]>(['c1'])
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" leftIcon={<Paperclip />} onClick={() => setOpen(true)}>
        Attach to a note ({picked.length})
      </Button>
      <span className="text-sm text-muted-foreground">
        {THINGS.filter((thing) => picked.includes(thing.id))
          .map((thing) => thing.title)
          .join(', ') || 'Nothing attached'}
      </span>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Attach"
        placeholder="An order, a customer…"
        grouped
        closeOnSelect={false}
        picked={picked}
        // Chosen again, taken back: what that means is the application's.
        onSelect={(item) => setPicked((was) => (was.includes(item.id) ? was.filter((id) => id !== item.id) : [...was, item.id]))}
        footer={`${picked.length} attached · Esc when done`}
        items={THINGS}
      />
    </div>
  )
}
