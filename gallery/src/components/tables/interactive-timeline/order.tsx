import { InteractiveTimeline } from 'ioiti-ui'

export default function InteractiveTimelineOrder() {
  return (
    <InteractiveTimeline
      label="Order 2026-0042"
      defaultExpandedIds={['packed']}
      items={[
        { id: 'placed', title: 'Placed', timestamp: '26 Oct, 09:12', status: 'completed', description: 'By Ana Martins, from the website.' },
        { id: 'paid', title: 'Paid', timestamp: '26 Oct, 09:13', status: 'completed', metrics: [{ label: 'Amount', value: '1,840.00 €' }] },
        { id: 'packed', title: 'Being packed', timestamp: '26 Oct, 10:40', status: 'in-progress', statusLabel: 'Now', description: 'Three boxes.' },
        { id: 'sent', title: 'Sent', timestamp: '—', status: 'pending' },
      ]}
    />
  )
}
