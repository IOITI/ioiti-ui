import { SegmentedControl } from 'ioiti-ui'
import { ChartLine, LayoutGrid, Rows3 } from 'lucide-react'

const VIEWS = [
  { value: 'table', label: 'Table', icon: <Rows3 /> },
  { value: 'cards', label: 'Cards', icon: <LayoutGrid /> },
  { value: 'chart', label: 'Chart', icon: <ChartLine />, disabled: true },
]

export default function SegmentedControlSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl label="View" defaultValue="table" options={VIEWS} />
      <SegmentedControl label="View" size="sm" defaultValue="table" options={VIEWS} />
    </div>
  )
}
