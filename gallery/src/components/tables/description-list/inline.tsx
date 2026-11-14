import { DescriptionList } from 'ioiti-ui'

export default function DescriptionListInline() {
  return (
    <div className="max-w-xl space-y-1">
      <h3 className="text-sm font-semibold">Order 2026-0042</h3>
      <DescriptionList
        layout="inline"
        compressed
        items={[
          { term: 'Placed', details: '26 Oct' },
          { term: 'Lines', details: '4' },
          { term: 'Paid by', details: 'Card' },
          { term: 'Customer', details: 'Atelier Brun' },
        ]}
      />
    </div>
  )
}
