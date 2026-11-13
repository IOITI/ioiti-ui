import { DonutChart } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-8 p-5 md:grid-cols-2">
    <DonutChart
      ariaLabel="Orders by channel"
      centerLabel="Orders"
      data={[
        { label: 'Shop', value: 560 },
        { label: 'Phone', value: 210 },
        { label: 'Partners', value: 190 },
        { label: 'Fairs', value: 80 },
        { label: 'Post', value: 40 },
        { label: 'Other sites', value: 25 },
      ]}
    />
    <DonutChart
      ariaLabel="Storage used"
      variant="semi"
      centerLabel="Used"
      showLegend={false}
      formatValue={(value) => `${Math.round(value)} GB`}
      data={[
        { label: 'Used', value: 312 },
        { label: 'Free', value: 188, color: 'var(--chart-muted)' },
      ]}
    />
  </div>,
)
