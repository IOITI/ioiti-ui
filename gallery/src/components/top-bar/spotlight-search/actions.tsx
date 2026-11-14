import { Button, SpotlightSearch, useTheme, useToast } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { Download, FilePlus2, Moon, Sun, Truck } from 'lucide-react'
import { useState } from 'react'

export default function SpotlightSearchActions() {
  const toast = useToast()
  const { setPreference } = useTheme()
  const [open, setOpen] = useState(false)
  const [chosen, setChosen] = useState<string | null>(null)
  // Each does something where it is chosen, in place of a page to go to.
  const items: SpotlightSearchItem[] = [
    { id: 'new', title: 'New order', category: 'Actions', icon: <FilePlus2 />, action: () => toast({ title: 'Order 2026-0043 created' }) },
    { id: 'export', title: 'Export the orders', category: 'Actions', description: 'As a CSV file', icon: <Download />, action: () => toast({ title: 'Orders exported', variant: 'success' }) },
    { id: 'carrier', title: 'Change the carrier', category: 'Actions', description: 'Of every order not sent yet', icon: <Truck />, keywords: ['shipping', 'delivery'], action: () => toast({ title: 'Carrier changed' }) },
    { id: 'light', title: 'Light theme', category: 'Appearance', icon: <Sun />, keywords: ['day', 'theme'], action: () => setPreference('light') },
    { id: 'dark', title: 'Dark theme', category: 'Appearance', icon: <Moon />, keywords: ['night', 'theme'], action: () => setPreference('dark') },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Do something…
      </Button>
      <span className="text-sm text-muted-foreground" aria-live="polite">
        Chosen: <span className="font-medium text-foreground">{chosen ?? 'nothing yet'}</span>
      </span>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Actions"
        placeholder="What do you want to do?"
        grouped
        items={items}
        onSelect={(item) => setChosen(item.title)}
      />
    </div>
  )
}
