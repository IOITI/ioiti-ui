import { Checkbox } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const TOPICS = ['Product updates', 'Invoices', 'Security alerts']

function Group() {
  const [chosen, setChosen] = useState<ReadonlySet<string>>(() => new Set(['Product updates']))
  const all = chosen.size === TOPICS.length
  const toggle = (topic: string) =>
    setChosen((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="Every email" checked={all} indeterminate={chosen.size > 0 && !all} onChange={() => setChosen(all ? new Set() : new Set(TOPICS))} />
      <div className="flex flex-col gap-3 pl-6.5">
        {TOPICS.map((topic) => (
          <Checkbox key={topic} label={topic} checked={chosen.has(topic)} onChange={() => toggle(topic)} />
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex w-full flex-wrap gap-x-12 gap-y-6 p-5">
    <Group />
    <div className="flex flex-col gap-3">
      <Checkbox label="Keep me signed in" description="On this browser only" defaultChecked />
      <Checkbox label="Share usage data" description="Turned off by the administrator" disabled />
      <Checkbox label="Archived" defaultChecked disabled />
    </div>
  </div>,
)
