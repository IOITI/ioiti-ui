import { DragToConfirm } from 'ioiti-ui'

export default function DragToConfirmVariants() {
  return (
    <div className="grid max-w-md gap-3">
      <DragToConfirm label="Slide to confirm" confirmedLabel="Confirmed" />
      <DragToConfirm label="Slide to approve" confirmedLabel="Approved" tone="success" />
      <DragToConfirm label="Slide to send" confirmedLabel="Sent" tone="info" />
      <DragToConfirm label="Slide to override" confirmedLabel="Overridden" tone="warning" />
      <DragToConfirm label="Slide to delete" confirmedLabel="Deleted" tone="danger" actionType="delete" />
    </div>
  )
}
