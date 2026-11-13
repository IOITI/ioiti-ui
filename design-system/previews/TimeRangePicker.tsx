import { AutoRefresh, TimeRangePicker, ToastProvider, formatDateTime, resolveTimeRange, useToast } from 'ioiti-ui'
import type { RefreshSettings, TimeRange } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

/** A time range and what it stands for now; refreshed on a press or on a timer. */
function Times() {
  const toast = useToast()
  const [range, setRange] = useState<TimeRange>({ from: 'now-24h', to: 'now' })
  const [refresh, setRefresh] = useState<RefreshSettings>({ interval: 30_000, paused: true })
  const [loading, setLoading] = useState(false)
  const [standalone, setStandalone] = useState<RefreshSettings>({ interval: 60_000, paused: true })
  const resolved = resolveTimeRange(range)
  const load = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
  }
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 p-5">
      <TimeRangePicker value={range} onChange={setRange} onRefresh={load} isLoading={loading} refresh={refresh} onRefreshChange={setRefresh} />
      <p className="text-xs text-muted-foreground">
        Now: from {formatDateTime(resolved.from?.toISOString(), 'Europe/Paris', false)} to {formatDateTime(resolved.to?.toISOString(), 'Europe/Paris', false)} (Paris
        time).
      </p>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        Alone, beside a page's title: <AutoRefresh value={standalone} onChange={setStandalone} onRefresh={() => toast({ title: 'Refreshed' })} />
      </div>
      <p className="text-xs text-muted-foreground">The calendar button opens the quick select; the range, its start and its end.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Times />
  </ToastProvider>,
)
