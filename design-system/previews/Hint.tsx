import { Button, Field, Hint, IconButton, Input } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-end gap-4 p-5">
    <Hint content="Remove the three files chosen">
      <IconButton label="Remove" icon={<Trash2 />} />
    </Hint>
    <Hint content="Choose two to four runs to compare them" wrap>
      <Button size="sm" disabled>Compare</Button>
    </Hint>
    <Field label="Amount" className="w-56">
      <Hint content="In euros, cents after a point" wrap className="flex w-full">
        <Input defaultValue="120.00" />
      </Hint>
    </Field>
  </div>,
)
