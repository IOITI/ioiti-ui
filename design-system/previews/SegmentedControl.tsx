import { SegmentedControl } from 'ioiti-ui'
import { ChartLine, LayoutGrid, Rows3 } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-4 p-5">
    <SegmentedControl
      label="Period"
      defaultValue="week"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]}
    />
    <SegmentedControl
      label="View"
      size="sm"
      defaultValue="table"
      options={[
        { value: 'table', label: 'Table', icon: <Rows3 /> },
        { value: 'cards', label: 'Cards', icon: <LayoutGrid /> },
        { value: 'chart', label: 'Chart', icon: <ChartLine />, disabled: true },
      ]}
    />
    <SegmentedControl
      label="Channel"
      fullWidth
      defaultValue="all"
      className="w-full max-w-sm"
      options={[
        { value: 'all', label: 'All' },
        { value: 'shop', label: 'Shop' },
        { value: 'phone', label: 'Phone' },
      ]}
    />
  </div>,
)
