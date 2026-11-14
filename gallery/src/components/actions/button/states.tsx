import { Button, Hint } from 'ioiti-ui'
import { Save } from 'lucide-react'
import { useState } from 'react'

export default function ButtonStates() {
  const [saving, setSaving] = useState(false)
  const save = () => {
    setSaving(true)
    window.setTimeout(() => setSaving(false), 1500)
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Save />} isLoading={saving} loadingText="Saving" onClick={save}>
        Save
      </Button>
      <Button variant="outline" isLoading loadingText="Sending">
        Send
      </Button>
      <Button disabled>Disabled</Button>
      <Hint content="Nothing changed since the last save" wrap>
        <Button variant="outline" disabled>
          Save again
        </Button>
      </Hint>
    </div>
  )
}
