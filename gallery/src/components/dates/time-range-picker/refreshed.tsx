import { formatDateTime, resolveTimeRange, TimeRangePicker, useNow } from 'ioiti-ui'
import type { RefreshSettings, TimeRange } from 'ioiti-ui'
import { useState } from 'react'

export default function TimeRangePickerRefreshed() {
  const [range, setRange] = useState<TimeRange>({ from: 'now-24h', to: 'now' })
  const [refresh, setRefresh] = useState<RefreshSettings>({ interval: 30_000, paused: true })
  const [loading, setLoading] = useState(false)
  const [loads, setLoads] = useState(0)
  // The time now, read again each minute: what the range stands for at this moment.
  const now = useNow(60_000)
  const { from, to } = resolveTimeRange(range, { now })
  const at = (date: Date | null) => formatDateTime(date?.toISOString(), 'Europe/Paris', false, new Date(now))

  // Asked on Refresh, on each new range, and on the timer.
  const load = () => {
    setLoading(true)
    setLoads((count) => count + 1)
    window.setTimeout(() => setLoading(false), 700)
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <TimeRangePicker value={range} onChange={setRange} onRefresh={load} isLoading={loading} refresh={refresh} onRefreshChange={setRefresh} />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Now: from {at(from)} to {at(to)} (Paris time). {loads ? `Loaded again ${loads} ${loads === 1 ? 'time' : 'times'}.` : 'Not loaded again yet.'}
      </p>
    </div>
  )
}
