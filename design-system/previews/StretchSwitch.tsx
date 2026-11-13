import { StretchSwitch } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [notify, setNotify] = useState(true)
  return (
    <div className="flex max-w-sm flex-col gap-3 p-5">
      <StretchSwitch checked={notify} onChange={setNotify} label="Notify the customer" description="An email when the order leaves" />
      <p className="text-xs text-muted-foreground">Press and hold it: the thumb stretches, then snaps to its side.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
