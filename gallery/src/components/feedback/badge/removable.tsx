import { Badge, Button } from 'ioiti-ui'
import { useState } from 'react'

const FILTERS = ['Status: open', 'Customer: Acme', 'City: Lyon', 'Over 1,000 €']

export default function BadgeRemovable() {
  const [filters, setFilters] = useState(FILTERS)
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Badge key={filter} removeLabel={`Remove ${filter}`} onRemove={() => setFilters((list) => list.filter((each) => each !== filter))}>
            {filter}
          </Badge>
        ))}
        {filters.length === 0 && <span className="text-sm text-muted-foreground">No filter: every order is shown.</span>}
      </div>
      <Button size="xs" variant="ghost" disabled={filters.length === FILTERS.length} onClick={() => setFilters(FILTERS)}>
        Put them back
      </Button>
    </div>
  )
}
