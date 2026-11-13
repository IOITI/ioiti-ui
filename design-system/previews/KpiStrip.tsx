import { KpiStrip, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="p-5">
    <KpiStrip
      title="The shop"
      period="Compared with yesterday"
      items={[
        { label: 'Visits', value: '9,120', change: 3.4 },
        { label: 'Carts', value: '311', change: -2.1 },
        { label: 'Basket', value: formatMoney(48.1, 'EUR'), change: 1.2 },
        { label: 'Returns', value: '2.1%', change: -0.4, goodWhen: 'down' },
        { label: 'Support tickets', value: '14', change: 16.7, goodWhen: 'down' },
      ]}
    />
  </div>,
)
