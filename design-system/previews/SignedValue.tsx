import { AnimatedNumber, Button, SignedValue } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [value, setValue] = useState(12.4)
  const [stale, setStale] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-4 overflow-hidden p-5">
      <SignedValue value={value} kind="percent" animate stale={stale} className="text-2xl font-semibold" />
      <SignedValue value={value * 34.2} kind="money" stale={stale} className="text-sm" />
      <SignedValue value={-3.5} kind="percent" className="text-sm" />
      <AnimatedNumber value={Math.round(value * 100)} useGrouping className="text-2xl font-semibold" />
      <Button size="sm" variant="outline" onClick={() => setValue((now) => Math.round((now - 9.7) * 100) / 100)}>Change it</Button>
      <Button size="sm" variant="outline" onClick={() => setStale(!stale)}>{stale ? 'The source is back' : 'The source stops'}</Button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
