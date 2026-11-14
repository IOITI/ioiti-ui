import { formatMoney, KpiGrid, KpiTile } from 'ioiti-ui'

export default function KpiTileChange() {
  return (
    <KpiGrid period="Compared with last week">
      {/* Up, and up is good: a gain. */}
      <KpiTile label="Orders" value="214" change={6.5} />
      {/* Down, and down is good for a delay. */}
      <KpiTile label="Median delivery" value="2.1 days" change={-8.7} goodWhen="down" />
      {/* Up, but up is bad for a cost. */}
      <KpiTile label="Shipping costs" value={formatMoney(1630, 'EUR')} change={12.3} goodWhen="down" />
      {/* Another unit than a percentage: money, signed. */}
      <KpiTile
        label="Average basket"
        value={formatMoney(52.4, 'EUR')}
        change={-0.95}
        changeFormat={(change) => formatMoney(change, 'EUR', true)}
        hint="per order"
      />
    </KpiGrid>
  )
}
