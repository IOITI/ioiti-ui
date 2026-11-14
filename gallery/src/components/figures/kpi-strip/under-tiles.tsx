import { formatMoney, KpiGrid, KpiStrip, KpiTile } from 'ioiti-ui'

export default function KpiStripUnderTiles() {
  return (
    <div className="space-y-4">
      <KpiGrid period="Compared with last Monday">
        <KpiTile label="Revenue today" value={formatMoney(4210, 'EUR')} change={8.2} />
        <KpiTile label="Orders today" value="38" change={4.2} />
        <KpiTile label="Median delivery" value="2.4 days" change={-6.1} goodWhen="down" />
        <KpiTile label="Returns" value="2.1%" change={-0.4} goodWhen="down" />
      </KpiGrid>
      <KpiStrip
        title="This week"
        period="Compared with last week"
        items={[
          { label: 'Orders', value: '214', change: 6.5 },
          { label: 'Customers', value: '96', change: 2.1 },
          { label: 'Basket', value: formatMoney(52.4, 'EUR'), change: -1.8 },
          { label: 'Refunds', value: '9', change: 12.5, goodWhen: 'down' },
        ]}
      />
    </div>
  )
}
