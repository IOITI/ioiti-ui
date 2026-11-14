import { AutoRefresh, useToast } from 'ioiti-ui'
import type { RefreshSettings } from 'ioiti-ui'
import { useState } from 'react'

export default function TimeRangePickerAutoRefresh() {
  const toast = useToast()
  const [every, setEvery] = useState<RefreshSettings>({ interval: 60_000, paused: true })
  return (
    <div className="flex w-full max-w-2xl flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
      <div>
        <p className="text-sm font-semibold">Deliveries under way</p>
        <p className="text-xs text-muted-foreground">{every.paused ? 'Not refreshed on its own' : `Refreshed every ${every.interval / 1000} s`}</p>
      </div>
      <AutoRefresh value={every} onChange={setEvery} onRefresh={() => toast({ title: 'Deliveries refreshed' })} />
    </div>
  )
}
