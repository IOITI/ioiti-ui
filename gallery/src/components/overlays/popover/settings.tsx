import { Checkbox, IconButton, Popover } from 'ioiti-ui'
import { Columns3 } from 'lucide-react'
import { useState } from 'react'

const COLUMNS = ['Reference', 'Customer', 'Status', 'Total']

export default function PopoverSettings() {
  const [shown, setShown] = useState(['Reference', 'Customer', 'Total'])
  return (
    <div className="flex max-w-md items-center justify-between gap-3 rounded-xl border border-border px-4 py-2">
      <span className="truncate text-sm text-muted-foreground">Columns: {shown.join(', ') || 'none'}</span>
      {/* At the end of a row: under its button, aligned on its end. Each box applies at once. */}
      <Popover label="Columns" side="bottom" align="end" trigger={<IconButton label="Columns" icon={<Columns3 />} hint="Choose the columns" />}>
        <div className="flex flex-col gap-2">
          {COLUMNS.map((column) => (
            <Checkbox
              key={column}
              label={column}
              checked={shown.includes(column)}
              onChange={(event) =>
                setShown(event.target.checked ? COLUMNS.filter((each) => each === column || shown.includes(each)) : shown.filter((each) => each !== column))
              }
            />
          ))}
        </div>
      </Popover>
    </div>
  )
}
