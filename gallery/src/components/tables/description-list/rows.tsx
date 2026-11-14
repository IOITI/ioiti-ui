import { DescriptionList, formatMoney } from 'ioiti-ui'

export default function DescriptionListRows() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <DescriptionList
        boxed
        numeric
        items={[
          { term: 'Subtotal', details: formatMoney(1533.33) },
          { term: 'Tax', details: formatMoney(306.67) },
          { term: 'Total', details: formatMoney(1840) },
        ]}
      />
      <DescriptionList
        divided
        items={[
          { term: 'Status', details: 'Paid' },
          { term: 'Paid by', details: 'Card ending 4242' },
          { term: 'Placed', details: '26 Oct, 09:12' },
          { term: 'Delivery', details: 'By courier, before noon' },
        ]}
      />
    </div>
  )
}
