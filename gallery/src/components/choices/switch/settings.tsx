import { Switch } from 'ioiti-ui'
import { useState } from 'react'

export default function SwitchSettings() {
  const [weekly, setWeekly] = useState(true)
  const [alerts, setAlerts] = useState(false)
  const [sound, setSound] = useState(true)
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
        <Switch className="p-3" label="Weekly summary" description="Every Monday, by email" checked={weekly} onChange={setWeekly} />
        <Switch className="p-3" label="Alerts on failed deliveries" description="As soon as a carrier gives up, by text message" checked={alerts} onChange={setAlerts} />
        <Switch className="p-3" label="Sound on new orders" description="In this browser, while the page is open" checked={sound} onChange={setSound} />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Summary {weekly ? 'on' : 'off'} · Alerts {alerts ? 'on' : 'off'} · Sound {sound ? 'on' : 'off'}
      </p>
    </div>
  )
}
