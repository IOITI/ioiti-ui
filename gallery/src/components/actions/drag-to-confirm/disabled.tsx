import { DragToConfirm } from 'ioiti-ui'

export default function DragToConfirmDisabled() {
  return (
    <div className="grid max-w-md gap-2">
      <DragToConfirm label="Slide to pay 1,840.00 €" disabled />
      <p className="text-sm text-muted-foreground">Payment opens once the order is approved.</p>
    </div>
  )
}
