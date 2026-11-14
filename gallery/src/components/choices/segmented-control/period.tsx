import { SegmentedControl } from 'ioiti-ui'
import { useState } from 'react'

type Period = 'day' | 'week' | 'month' | 'year'

export default function SegmentedControlPeriod() {
  const [period, setPeriod] = useState<Period>('week')
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl<Period>
        label="Period"
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Orders of the last {period}.
      </p>
    </div>
  )
}
