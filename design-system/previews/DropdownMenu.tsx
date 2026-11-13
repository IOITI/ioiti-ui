import { Button, ContextMenu, DropdownMenu, IconButton } from 'ioiti-ui'
import { Archive, Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [compact, setCompact] = useState(false)
  const [sort, setSort] = useState('newest')
  const items = [
    { label: 'Edit', icon: <Pencil />, shortcut: 'e', onSelect: () => {} },
    { label: 'Duplicate', icon: <Copy />, shortcut: 'mod+d', onSelect: () => {} },
    { type: 'link' as const, label: 'Open the customer', href: '#customer' },
    {
      type: 'submenu' as const,
      label: 'Export',
      icon: <Archive />,
      items: [
        { label: 'As CSV', onSelect: () => {} },
        { label: 'As PDF', description: 'One page per order', onSelect: () => {} },
      ],
    },
    { type: 'separator' as const },
    { type: 'checkbox' as const, label: 'Compact rows', checked: compact, onCheckedChange: setCompact },
    {
      type: 'radio' as const,
      label: 'Sort',
      value: sort,
      onValueChange: setSort,
      options: [
        { value: 'newest', label: 'Newest first' },
        { value: 'oldest', label: 'Oldest first' },
      ],
    },
    { type: 'separator' as const },
    { label: 'Delete', icon: <Trash2 />, tone: 'danger' as const, onSelect: () => {} },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3 p-5">
      <DropdownMenu label="Actions on order IT-1042" trigger={<Button variant="outline" size="sm">Actions</Button>} items={items} />
      <DropdownMenu label="More actions" trigger={<IconButton label="More actions" icon={<Ellipsis />} hint="More actions" />} items={items} />
      <ContextMenu label="Actions on order IT-1042" items={items}>
        <div tabIndex={0} className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
          Right-click here, press and hold, or Shift+F10 once it has the focus
        </div>
      </ContextMenu>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
