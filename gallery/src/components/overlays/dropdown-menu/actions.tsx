import { Button, DropdownMenu, IconButton, useToast } from 'ioiti-ui'
import type { DropdownMenuItem } from 'ioiti-ui'
import { Archive, ChevronDown, Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DropdownMenuActions() {
  const toast = useToast()
  const [compact, setCompact] = useState(false)
  const [sort, setSort] = useState('newest')
  const said = (title: string) => () => toast({ title })
  // A menu of actions on an order: a link, a sub-menu, boxes ticked, the one that removes last.
  const items: DropdownMenuItem[] = [
    { label: 'Edit', icon: <Pencil />, shortcut: 'e', onSelect: said('Editing IT-1042') },
    { label: 'Duplicate', icon: <Copy />, shortcut: 'mod+d', onSelect: said('IT-1042 duplicated') },
    { type: 'link', label: 'Open the customer', href: '/patterns/dashboard' },
    {
      type: 'submenu',
      label: 'Export',
      icon: <Archive />,
      items: [
        { label: 'As CSV', onSelect: said('Exported as CSV') },
        { label: 'As PDF', description: 'One page per order', onSelect: said('Exported as PDF') },
      ],
    },
    { type: 'separator' },
    { type: 'checkbox', label: 'Compact rows', checked: compact, onCheckedChange: setCompact },
    {
      type: 'radio',
      label: 'Sort',
      value: sort,
      onValueChange: setSort,
      options: [
        { value: 'newest', label: 'Newest first' },
        { value: 'oldest', label: 'Oldest first' },
      ],
    },
    { type: 'separator' },
    { label: 'Delete', icon: <Trash2 />, tone: 'danger', onSelect: said('IT-1042 deleted') },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DropdownMenu
        label="Actions on order IT-1042"
        trigger={
          <Button variant="outline" size="sm" rightIcon={<ChevronDown />}>
            Actions
          </Button>
        }
        items={items}
      />
      <DropdownMenu label="More actions on order IT-1042" align="end" trigger={<IconButton label="More actions" icon={<Ellipsis />} hint="More actions" />} items={items} />
      <span className="text-sm text-muted-foreground">
        Rows: {compact ? 'compact' : 'comfortable'} · {sort === 'newest' ? 'newest' : 'oldest'} first
      </span>
    </div>
  )
}
