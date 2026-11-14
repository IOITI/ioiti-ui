import { Button, Hint, IconButton } from 'ioiti-ui'
import { Download, RotateCw, Trash2 } from 'lucide-react'

export default function HintControls() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* The label says what it does; the hint, what more there is to know. */}
      <Hint content="Last refreshed 4 minutes ago">
        <Button size="sm" variant="outline" leftIcon={<RotateCw />}>
          Refresh
        </Button>
      </Hint>
      <Hint content="Every column, as a CSV file">
        <Button size="sm" variant="outline" leftIcon={<Download />}>
          Export
        </Button>
      </Hint>
      {/* An IconButton takes its hint as a prop, under it. */}
      <IconButton label="Remove" icon={<Trash2 />} hint="Remove the three files chosen" />
    </div>
  )
}
