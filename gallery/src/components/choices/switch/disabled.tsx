import { Switch } from 'ioiti-ui'

export default function SwitchDisabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Switch label="Two-step sign-in" description="Required by the administrator for every account" defaultChecked disabled />
      <Switch label="Payments by card" description="Available once the account is verified" disabled />
    </div>
  )
}
