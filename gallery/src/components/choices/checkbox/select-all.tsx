import { Checkbox } from 'ioiti-ui'
import { useState } from 'react'

const TOPICS = ['Product updates', 'Newsletter', 'Beta features']

export default function CheckboxSelectAll() {
  const [chosen, setChosen] = useState<ReadonlySet<string>>(() => new Set(['Product updates']))
  const all = chosen.size === TOPICS.length
  const toggle = (topic: string) =>
    setChosen((previous) => {
      const next = new Set(previous)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Checkbox
          label="Every email"
          checked={all}
          indeterminate={chosen.size > 0 && !all}
          onChange={() => setChosen(all ? new Set() : new Set(TOPICS))}
        />
        <div className="flex flex-col gap-3 pl-6.5">
          {TOPICS.map((topic) => (
            <Checkbox key={topic} label={topic} checked={chosen.has(topic)} onChange={() => toggle(topic)} />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen.size ? `Sent: ${TOPICS.filter((topic) => chosen.has(topic)).join(', ')}.` : 'No email sent.'}
      </p>
    </div>
  )
}
