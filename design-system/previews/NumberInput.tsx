import { Field, NumberInput } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-4 p-5 sm:grid-cols-3">
    <Field label="Daily limit" htmlFor="daily-limit">
      <NumberInput id="daily-limit" defaultValue={500} min={0} max={5000} step={50} suffix="€" />
    </Field>
    <Field label="Copies" htmlFor="copies">
      <NumberInput id="copies" defaultValue={2} min={1} max={20} integer />
    </Field>
    <Field label="Delay before retrying" htmlFor="retry-delay">
      <NumberInput id="retry-delay" defaultValue={1.5} min={0} step={0.5} precision={1} suffix="s" />
    </Field>
  </div>,
)
