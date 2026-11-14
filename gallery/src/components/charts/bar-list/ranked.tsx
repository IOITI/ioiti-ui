import { BarList } from 'ioiti-ui'

export default function BarListRanked() {
  return (
    <BarList
      className="max-w-md"
      label="Returns by reason"
      items={[
        // A row may lead to what it counts: the returns of that reason, in their table.
        { label: 'Too small', value: 42, href: '/components/tables/data-table' },
        { label: 'Not as described', value: 28, href: '/components/tables/data-table' },
        { label: 'Damaged on the way', value: 17, tone: 'negative' },
        { label: 'Changed their mind', value: 11 },
        { label: 'Arrived too late', value: 4 },
      ]}
    />
  )
}
