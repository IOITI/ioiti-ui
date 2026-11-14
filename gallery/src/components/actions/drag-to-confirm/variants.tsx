import { DragToConfirm } from 'ioiti-ui'

export default function DragToConfirmVariants() {
  return (
    <div className="grid max-w-md gap-3">
      <DragToConfirm label="Slide to confirm" confirmedLabel="Confirmed" />
      <DragToConfirm label="Slide to approve" confirmedLabel="Approved" variant="success" />
      <DragToConfirm label="Slide to send" confirmedLabel="Sent" variant="info" />
      <DragToConfirm label="Slide to override" confirmedLabel="Overridden" variant="warning" />
      <DragToConfirm label="Slide to delete" confirmedLabel="Deleted" variant="danger" actionType="delete" />
    </div>
  )
}
