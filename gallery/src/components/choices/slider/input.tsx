import { Slider } from 'ioiti-ui'
import { useState } from 'react'

export default function SliderInput() {
  const [delay, setDelay] = useState(30)
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Slider label="Delay before retrying" value={delay} onChange={setDelay} min={0} max={120} step={5} format={(value) => `${value} s`} showInput />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {delay === 0 ? 'Retried at once.' : `Retried after ${delay} seconds.`}
      </p>
    </div>
  )
}
