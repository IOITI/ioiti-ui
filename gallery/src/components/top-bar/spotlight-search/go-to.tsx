import { Button, Kbd, SpotlightSearch } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { Building2, ChartColumn, Receipt, Search, TextCursorInput } from 'lucide-react'
import { useState } from 'react'

// Each leads to a page: a link, followed with Enter too (⌘ or Ctrl and a click: another tab).
const ITEMS: SpotlightSearchItem[] = [
  { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/components/tables', keywords: ['acme'], icon: <Receipt /> },
  { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Brasserie Lefèvre · 960.50 €', href: '/components/tables', icon: <Receipt /> },
  { id: 'c1', title: 'Acme', category: 'Customers', description: '38 orders this year', href: '/components/tables', icon: <Building2 /> },
  { id: 'c2', title: 'Brasserie Lefèvre', category: 'Customers', description: '12 orders this year', href: '/components/tables', icon: <Building2 /> },
  // Its keys as this computer writes them (Kbd): G, then F.
  { id: 'p1', title: 'Forms', category: 'Pages', href: '/components/forms', icon: <TextCursorInput />, shortcut: 'g f' },
  { id: 'p2', title: 'Charts', category: 'Pages', href: '/components/charts', icon: <ChartColumn />, shortcut: 'g c' },
]

export default function SpotlightSearchGoTo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" leftIcon={<Search />} onClick={() => setOpen(true)}>
        Go to…
      </Button>
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        Type “lefevre”: found whatever its accents, the customer before the order. The gallery’s own opens with <Kbd keys="mod+k" />
      </span>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to"
        placeholder="An order, a customer, a page…"
        grouped
        recentSearches={['acme', 'refund']}
        items={ITEMS}
      />
    </div>
  )
}
