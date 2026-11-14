import { StretchSwitch } from 'ioiti-ui'

export default function StretchSwitchDisabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <StretchSwitch label="Signed delivery" description="Always, for an order over 1,000 €" defaultChecked disabled />
      <StretchSwitch label="Delivery on Sundays" description="Not offered by this carrier" disabled />
    </div>
  )
}
