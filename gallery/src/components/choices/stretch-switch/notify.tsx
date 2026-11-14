import { StretchSwitch } from 'ioiti-ui'
import { useState } from 'react'

export default function StretchSwitchNotify() {
  const [notify, setNotify] = useState(true)
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <StretchSwitch checked={notify} onChange={setNotify} label="Notify the customer" description="An email when the order leaves" />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {notify ? 'The customer is told when the order leaves.' : 'The customer is not told.'}
      </p>
    </div>
  )
}
