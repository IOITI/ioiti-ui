import { Button, DropdownMenu } from 'ioiti-ui'
import { Columns3 } from 'lucide-react'
import { useState } from 'react'

const COLUMNS = ['Reference', 'Customer', 'Status', 'Total', 'Created']

export default function DropdownMenuTicked() {
  const [shown, setShown] = useState(['Reference', 'Customer', 'Total'])
  const [density, setDensity] = useState('comfortable')
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* A box ticked keeps the menu open; a choice of one closes it. */}
      <DropdownMenu
        label="Table settings"
        trigger={
          <Button size="sm" variant="outline" leftIcon={<Columns3 />}>
            View
          </Button>
        }
        items={[
          {
            type: 'group',
            label: 'Columns',
            items: COLUMNS.map((column) => ({
              type: 'checkbox' as const,
              label: column,
              checked: shown.includes(column),
              disabled: column === 'Reference',
              onCheckedChange: (checked: boolean) =>
                setShown(checked ? COLUMNS.filter((each) => each === column || shown.includes(each)) : shown.filter((each) => each !== column)),
            })),
          },
          { type: 'separator' },
          {
            type: 'radio',
            label: 'Density',
            value: density,
            onValueChange: setDensity,
            options: [
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact', description: 'More rows on the screen' },
            ],
          },
        ]}
      />
      <span className="text-sm text-muted-foreground">
        {shown.join(', ')} · {density}
      </span>
    </div>
  )
}
