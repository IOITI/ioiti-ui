import { formatMoney, KpiGrid, KpiTile } from 'ioiti-ui'

export default function KpiTileColumns() {
  return (
    <KpiGrid columns={3} period="This week">
      <KpiTile label="Returns" value="38" hint="2.1% of the orders" />
      <KpiTile label="Refunded" value={formatMoney(1260, 'EUR')} hint="To 31 customers" />
      <KpiTile label="Median delivery" value="2.4 days" hint="−0.3 on last week" />
    </KpiGrid>
  )
}
