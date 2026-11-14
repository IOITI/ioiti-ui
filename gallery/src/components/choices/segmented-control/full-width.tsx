import { SegmentedControl } from 'ioiti-ui'

export default function SegmentedControlFullWidth() {
  return (
    <div className="flex max-w-sm flex-col gap-4 rounded-xl border border-dashed border-border p-3">
      <SegmentedControl
        label="Channel"
        fullWidth
        defaultValue="all"
        options={[
          { value: 'all', label: 'All' },
          { value: 'shop', label: 'Shop' },
          { value: 'phone', label: 'Phone' },
        ]}
      />
      <SegmentedControl
        label="Paid by"
        size="sm"
        fullWidth
        defaultValue="card"
        options={[
          { value: 'card', label: 'Card' },
          { value: 'transfer', label: 'Transfer' },
        ]}
      />
    </div>
  )
}
