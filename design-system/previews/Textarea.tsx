import { Field, Textarea } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-4 p-5 sm:grid-cols-2">
    <Field label="Note">
      <Textarea rows={3} placeholder="What the warehouse should know" />
    </Field>
    <Field label="Delivery instructions" description="Read by the driver at the door: a code, a floor, where to leave it">
      <Textarea rows={5} defaultValue={'Code 4B21 at the gate.\nThird floor, the door on the left.\nIf no one answers, leave it with the caretaker.'} />
    </Field>
  </div>,
)
