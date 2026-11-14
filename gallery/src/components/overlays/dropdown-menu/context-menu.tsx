import { ContextMenu, useToast } from 'ioiti-ui'
import { Copy, ExternalLink, Pencil, Trash2 } from 'lucide-react'

export default function DropdownMenuContextMenu() {
  const toast = useToast()
  return (
    <ContextMenu
      label="Actions on delivery DL-310"
      items={[
        { label: 'Rename', icon: <Pencil />, onSelect: () => toast({ title: 'Renaming DL-310' }) },
        { label: 'Copy its number', icon: <Copy />, onSelect: () => toast({ title: 'DL-310 copied' }) },
        { type: 'link', label: 'Open it', icon: <ExternalLink />, href: '/patterns/dashboard' },
        { type: 'separator' },
        { label: 'Cancel the delivery', icon: <Trash2 />, tone: 'danger', onSelect: () => toast({ title: 'DL-310 cancelled' }) },
      ]}
    >
      {/* What it is the menu of takes the focus, for Shift+F10 and the menu key. */}
      <div tabIndex={0} className="max-w-md rounded-xl border border-dashed border-border p-4">
        <p className="text-sm font-medium">Delivery DL-310</p>
        <p className="text-xs text-muted-foreground">3 parcels to Lyon · leaves tomorrow</p>
        <p className="mt-3 text-xs text-muted-foreground">Right-click here, press and hold, or Shift+F10 once it has the focus.</p>
      </div>
    </ContextMenu>
  )
}
