import { FunnelChart } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="w-full p-5">
    <FunnelChart
      noun="Visits"
      summaryLabel="of the visits ended in a purchase"
      formatValue={(value) => value.toLocaleString('en-GB')}
      stages={[
        { label: 'Visited', value: 12480, dropLabel: 'left on the first page' },
        { label: 'Saw a product', value: 5210, dropLabel: 'did not add it' },
        { label: 'Added to the basket', value: 1380, dropLabel: 'left the basket' },
        { label: 'Paid', value: 642 },
      ]}
    />
  </div>,
)
