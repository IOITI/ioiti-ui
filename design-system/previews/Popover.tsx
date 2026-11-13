import { Button, Checkbox, IconButton, Input, Popover, SegmentedControl } from 'ioiti-ui'
import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [filters, setFilters] = useState({ customer: '', status: 'all' })
  return (
    <div className="flex flex-wrap items-center gap-3 p-5">
      <Popover label="Filters" trigger={<Button variant="outline" size="sm">Filters</Button>}>
        {(close) => (
          <form className="flex w-64 flex-col gap-3" onSubmit={(event) => { event.preventDefault(); close() }}>
            <Input placeholder="Customer" aria-label="Customer" value={filters.customer} onChange={(event) => setFilters({ ...filters, customer: event.target.value })} />
            <SegmentedControl
              label="Status"
              size="sm"
              fullWidth
              value={filters.status}
              onChange={(status) => setFilters({ ...filters, status })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'open', label: 'Open' },
                { value: 'paid', label: 'Paid' },
              ]}
            />
            <Button type="submit" size="sm">Apply</Button>
          </form>
        )}
      </Popover>
      <Popover label="Columns" side="bottom" align="start" trigger={<IconButton label="Columns" icon={<Columns3 />} hint="Choose the columns" />}>
        <div className="flex flex-col gap-2">
          {['Reference', 'Customer', 'Status', 'Total'].map((column) => (
            <Checkbox key={column} label={column} defaultChecked={column !== 'Status'} />
          ))}
        </div>
      </Popover>
      <span className="text-xs text-muted-foreground">Press a button to open its panel.</span>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
