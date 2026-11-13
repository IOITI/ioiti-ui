import { Button, SpotlightSearch } from 'ioiti-ui'
import { Building2, Receipt, TextCursorInput } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Palette() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open a palette
      </Button>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to"
        placeholder="An order, a customer…"
        grouped
        recentSearches={['acme', 'refund']}
        items={[
          { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '#order-2026-0042', keywords: ['acme'], icon: <Receipt /> },
          { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Globex · 960.50 €', href: '#order-2026-0041', icon: <Receipt /> },
          { id: 'c1', title: 'Acme', category: 'Customers', href: '#acme', icon: <Building2 /> },
          { id: 'p1', title: 'Forms', category: 'Pages', href: '#forms', icon: <TextCursorInput />, shortcut: ['G', 'F'] },
        ]}
      />
    </>
  )
}

// It stays open to choose several things, each ticked once chosen; chosen again, it is taken back.
function PickSeveral() {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string[]>(['c1'])
  const things = [
    { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', icon: <Receipt /> },
    { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Globex · 960.50 €', icon: <Receipt /> },
    { id: 'c1', title: 'Acme', category: 'Customers', icon: <Building2 /> },
    { id: 'c2', title: 'Globex', category: 'Customers', icon: <Building2 /> },
  ]
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Attach to a note ({picked.length})
      </Button>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Attach"
        placeholder="An order, a customer…"
        grouped
        closeOnSelect={false}
        picked={picked}
        onSelect={(item) => setPicked((was) => (was.includes(item.id) ? was.filter((id) => id !== item.id) : [...was, item.id]))}
        footer={`${picked.length} attached · Esc when done`}
        items={things}
      />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex min-h-[31rem] flex-col items-start gap-2 p-5">
    <div className="flex flex-wrap gap-2">
      <Palette />
      <PickSeveral />
    </div>
    <span className="text-xs text-muted-foreground">Press one: the palette opens over the page, the focus in its field. The arrows move, Enter follows, Escape closes.</span>
  </div>,
)
