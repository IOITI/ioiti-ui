import { formatMoney, KpiStrip } from 'ioiti-ui'

export default function KpiStripColumns() {
  return (
    <KpiStrip
      title="October"
      period="Compared with September"
      columns={3}
      items={[
        { label: 'Orders', value: '1,284', change: 9.1 },
        { label: 'Customers', value: '612', change: 4.4 },
        { label: 'Revenue', value: formatMoney(68420, 'EUR'), change: 11.8 },
        // Another unit than a percentage: money, signed.
        { label: 'Basket', value: formatMoney(53.3, 'EUR'), change: 1.2, changeFormat: (change) => formatMoney(change, 'EUR', true) },
        { label: 'Returns', value: '38', change: -12, goodWhen: 'down' },
        // No change to show: its hint says what it is.
        { label: 'Busiest day', value: 'Friday 24', hint: '81 orders' },
      ]}
    />
  )
}
