import { FunnelChart } from 'ioiti-ui'

export default function FunnelChartWithoutSummary() {
  return (
    <div className="max-w-xl">
      {/* Its own heading says what the summary would: the summary is left out. */}
      <p className="mb-3 text-sm font-medium">Orders of October, placed to delivered</p>
      <FunnelChart
        ariaLabel="Orders of October, from placed to delivered"
        noun="Orders"
        showSummary={false}
        stages={[
          { label: 'Placed', value: 1840, dropLabel: 'cancelled before payment' },
          { label: 'Paid', value: 1712, dropLabel: 'out of stock' },
          { label: 'Shipped', value: 1690, dropLabel: 'lost or sent back' },
          { label: 'Delivered', value: 1671 },
        ]}
      />
    </div>
  )
}
