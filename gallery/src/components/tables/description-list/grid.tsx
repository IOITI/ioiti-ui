import { DescriptionList } from 'ioiti-ui'

export default function DescriptionListGrid() {
  return (
    <div className="space-y-8">
      <DescriptionList
        layout="grid"
        columns={3}
        numeric
        items={[
          { term: 'Orders', details: '1,284' },
          { term: 'Returned', details: '38' },
          { term: 'Median delivery', details: '2.4 days' },
        ]}
      />
      <DescriptionList
        layout="grid"
        columns={4}
        numeric
        boxed
        items={[
          { term: 'Weight', details: '4.2 kg' },
          { term: 'Boxes', details: '3' },
          { term: 'Volume', details: '0.08 m³' },
          { term: 'Insured for', details: '1,840.00 €' },
        ]}
      />
    </div>
  )
}
