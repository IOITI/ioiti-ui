import { Checkbox, formatMoney, SelectionBasket } from 'ioiti-ui'
import { Download, Mail } from 'lucide-react'
import { useState } from 'react'

const INVOICES = [
  { id: 'INV-2210', customer: 'Atelier Brun', amount: 1840 },
  { id: 'INV-2209', customer: 'Maison Vidal', amount: 960.5 },
  { id: 'INV-2208', customer: 'Studio Nord', amount: 4320 },
  { id: 'INV-2207', customer: 'Librairie Lune', amount: 415 },
  { id: 'INV-2206', customer: 'Café Central', amount: 128.9 },
  { id: 'INV-2205', customer: 'Garage Martin', amount: 2750 },
]

export default function SelectionBasketContained() {
  const [selected, setSelected] = useState<string[]>(['INV-2209', 'INV-2207'])
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter((other) => other !== id) : [...selected, id])
  return (
    // Positioned: the basket floats at its foot.
    <div className="relative max-w-lg overflow-hidden rounded-xl border border-border/70">
      {/* Room under the last row for the basket. */}
      <ul className="max-h-72 divide-y divide-border/40 overflow-y-auto px-4 pb-20">
        {INVOICES.map((invoice) => (
          <li key={invoice.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            <Checkbox
              label={`${invoice.id} · ${invoice.customer}`}
              checked={selected.includes(invoice.id)}
              onChange={() => toggle(invoice.id)}
            />
            <span className="shrink-0 tabular-nums">{formatMoney(invoice.amount, 'EUR')}</span>
          </li>
        ))}
      </ul>
      <SelectionBasket
        mode="contained"
        selectedCount={selected.length}
        totalCount={INVOICES.length}
        noun={['invoice', 'invoices']}
        onClearSelection={() => setSelected([])}
        onSelectAll={() => setSelected(selected.length === INVOICES.length ? [] : INVOICES.map((invoice) => invoice.id))}
        actions={[
          { id: 'send', label: 'Send', icon: <Mail className="size-3.5" />, variant: 'primary' },
          { id: 'download', label: 'Download', icon: <Download className="size-3.5" /> },
        ]}
      />
    </div>
  )
}
