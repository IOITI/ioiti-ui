import { RadioGroup, Switch } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-8 p-5 sm:grid-cols-2">
    <div className="flex flex-col gap-4">
      <Switch label="Weekly summary" description="Every Monday, by email" defaultChecked />
      <Switch label="Alerts by text message" description="For high severity only" />
      <Switch label="Two-step sign-in" description="Required by the administrator" defaultChecked disabled />
    </div>
    <RadioGroup
      name="delivery"
      defaultValue="standard"
      options={[
        { value: 'standard', label: 'Standard', description: 'Three to five days' },
        { value: 'express', label: 'Express', description: 'Tomorrow' },
      ]}
    />
  </div>,
)
