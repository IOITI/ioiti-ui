import { Button, Input, Popover, SegmentedControl } from 'ioiti-ui'
import { ListFilter } from 'lucide-react'
import { useState } from 'react'

type Status = 'all' | 'open' | 'paid'

export default function PopoverForm() {
  // What is applied, and the draft the popover edits: Apply carries one to the other and closes it.
  const [applied, setApplied] = useState({ customer: '', status: 'all' as Status })
  const [draft, setDraft] = useState(applied)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover
        label="Filters"
        onOpenChange={(open) => open && setDraft(applied)}
        trigger={
          <Button variant="outline" size="sm" leftIcon={<ListFilter />}>
            Filters
          </Button>
        }
      >
        {(close) => (
          <form
            className="flex w-64 flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              setApplied(draft)
              close()
            }}
          >
            <Input placeholder="Customer" aria-label="Customer" value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} />
            <SegmentedControl
              label="Status"
              size="sm"
              fullWidth
              value={draft.status}
              onChange={(status) => setDraft({ ...draft, status })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'open', label: 'Open' },
                { value: 'paid', label: 'Paid' },
              ]}
            />
            <Button type="submit" size="sm">
              Apply
            </Button>
          </form>
        )}
      </Popover>
      <span className="text-sm text-muted-foreground">
        Showing {applied.status === 'all' ? 'every' : applied.status} invoice{applied.status === 'all' ? '' : 's'}
        {applied.customer ? ` of “${applied.customer}”` : ''}.
      </span>
    </div>
  )
}
