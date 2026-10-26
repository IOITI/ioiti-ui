import type { ReactNode } from 'react'

import { Alert, AlertDescription } from './ui/alert.js'
import { Button } from './ui/button.js'
import { DragToConfirm } from './ui/drag-to-confirm.js'
import { SettleModal } from './ui/settle-modal.js'

interface ConfirmActionProps {
  open: boolean
  title: string
  /** Exactly what will happen, in the user's terms. */
  description: ReactNode
  /** Text on the slider, e.g. "Slide to send"; with `gesture="button"`, the text of the button. */
  confirmLabel: string
  /** What is at stake, said first ("This sends the order to the live account."). Nothing by default. */
  warning?: ReactNode
  /**
   * How it is confirmed. The slide is for what puts something at risk or cannot be
   * taken back. A plain button is for the protective direction (pausing), which
   * has to be quick: `confirmLabel` is then the text of that button.
   */
  gesture?: 'slide' | 'button'
  /** Shown on the slider once it is done ("Saved", "Sent"...). */
  doneLabel?: string
  /** Shown on the slider while the action is under way. */
  workingLabel?: string
  cancelLabel?: string
  pending?: boolean
  /** The gesture waits for something the description asks first (a box ticked). */
  blocked?: boolean
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}

/**
 * The last step before an action that matters. The user reads what is about
 * to happen, then has to drag the slider to the end (with a keyboard: focus it
 * and press Enter): a deliberate gesture, not a button under the cursor.
 */
export function ConfirmAction({
  open,
  title,
  description,
  confirmLabel,
  warning,
  gesture = 'slide',
  doneLabel = 'Done',
  workingLabel = 'Working…',
  cancelLabel = 'Cancel',
  pending = false,
  blocked = false,
  error,
  onConfirm,
  onClose,
}: ConfirmActionProps) {
  return (
    <SettleModal
      open={open}
      onClose={pending ? () => {} : onClose}
      title={title}
      closeOnBackdrop={!pending}
      hideCloseButton={pending}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={pending}>
            {cancelLabel}
          </Button>
          {gesture === 'button' && (
            <Button size="sm" isLoading={pending} disabled={blocked} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {warning && (
          <Alert tone="warning">
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
        <div className="text-sm leading-relaxed text-text-secondary">{description}</div>
        {error && (
          <Alert tone="danger" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {gesture === 'slide' && (
          <DragToConfirm
            // A fresh slider every time the dialog opens or an attempt failed.
            key={`${open}-${error ?? ''}`}
            label={confirmLabel}
            confirmedLabel={pending ? workingLabel : doneLabel}
            variant="warning"
            autoResetDelay={0}
            haptic={false}
            disabled={pending || blocked}
            onConfirm={onConfirm}
          />
        )}
      </div>
    </SettleModal>
  )
}
