import { SegmentedControl } from 'ioiti-ui'
import { useId, useState } from 'react'

type Tab = 'summary' | 'items' | 'history'

const PANELS: Record<Tab, { label: string; text: string }> = {
  summary: { label: 'Summary', text: 'Order IT-1042, placed on 12 Nov 2026 by Atelier Brun: 3 items, 1,840.00 €.' },
  items: { label: 'Items', text: 'Spring catalogue (2,000 copies), proofs, delivery to Lyon.' },
  history: { label: 'History', text: 'Placed on 12 Nov, approved on 13 Nov, sent to the printer on 14 Nov.' },
}

export default function SegmentedControlTabs() {
  const id = useId()
  const [tab, setTab] = useState<Tab>('summary')
  return (
    <div className="flex w-full max-w-lg flex-col items-start gap-3">
      <SegmentedControl<Tab>
        role="tablist"
        label="Order"
        size="sm"
        value={tab}
        onChange={setTab}
        options={(Object.keys(PANELS) as Tab[]).map((value) => ({ value, label: PANELS[value].label, panelId: `${id}-${value}` }))}
      />
      {(Object.keys(PANELS) as Tab[]).map((value) => (
        <div
          key={value}
          id={`${id}-${value}`}
          role="tabpanel"
          aria-label={PANELS[value].label}
          hidden={value !== tab}
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm"
        >
          {PANELS[value].text}
        </div>
      ))}
    </div>
  )
}
