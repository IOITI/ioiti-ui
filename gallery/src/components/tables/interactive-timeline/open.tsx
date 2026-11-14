import { InteractiveTimeline } from 'ioiti-ui'

export default function InteractiveTimelineOpen() {
  return (
    <InteractiveTimeline
      label="Return R-118"
      collapsible={false}
      defaultExpandedIds={['asked', 'received', 'refunded']}
      items={[
        { id: 'asked', title: 'Return asked', timestamp: '2 Nov, 18:40', status: 'completed', description: 'Two of the four items: the wrong size.' },
        { id: 'received', title: 'Parcel received', timestamp: '5 Nov, 11:15', status: 'completed', description: 'Both items, unused, in their box.' },
        { id: 'refunded', title: 'Refunded', timestamp: '5 Nov, 11:32', status: 'completed', metrics: [{ label: 'Refunded', value: '214.00 €' }] },
      ]}
    />
  )
}
