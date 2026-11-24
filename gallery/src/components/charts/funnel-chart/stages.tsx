import { FunnelChart, useFormat } from 'ioiti-ui'

export default function FunnelChartStages() {
  const { formatNumber } = useFormat()
  return (
    <FunnelChart
      ariaLabel="Visits, from the first page to the payment"
      noun="Visits"
      summaryLabel="of the visits ended in a purchase"
      formatValue={(value) => formatNumber(value)}
      stages={[
        { label: 'Visited', value: 12480, dropLabel: 'left on the first page' },
        { label: 'Saw a product', value: 5210, dropLabel: 'did not add it' },
        { label: 'Added to the basket', value: 1380, dropLabel: 'left the basket' },
        { label: 'Paid', value: 642 },
      ]}
    />
  )
}
