import type { ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { useMessages } from './locale-context.js'
import { Alert, AlertDescription } from './ui/alert.js'
import { Button } from './ui/button.js'
import { DragToConfirm } from './ui/drag-to-confirm.js'
import { SettleModal } from './ui/settle-modal.js'

interface ConfirmActionProps {
  /** Open, held by the page (told of each change by `onOpenChange`, of its closing by `onClose`). */
  open?: boolean
  /** Open at first, the dialog holding it then (Cancel and Escape close it); closed by default. */
  defaultOpen?: boolean
  /** Told of every change, whoever holds it: `false` when Cancel, Escape, its backdrop or its × closes it. */
  onOpenChange?: (open: boolean) => void
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
  /** Shown on the slider once it is done ("Saved", "Sent"...): "Done" in the provider's language by default. */
  doneLabel?: string
  /** Shown on the slider while the action is under way: "Working…" in the provider's language by default. */
  workingLabel?: string
  /** The button that closes it: "Cancel" in the provider's language by default. */
  cancelLabel?: string
  pending?: boolean
  /** The gesture waits for something the description asks first (a box ticked). */
  blocked?: boolean
  error?: string | null
  onConfirm: () => void
  /** Told when Cancel, Escape, its backdrop or its × closes it (never while `pending`). */
  onClose?: () => void
}

/**
 * The last step before an action that matters. The user reads what is about
 * to happen, then has to drag the slider to the end (with a keyboard: focus it
 * and press Enter): a deliberate gesture, not a button under the cursor.
 */
export function ConfirmAction({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  confirmLabel,
  warning,
  gesture = 'slide',
  doneLabel,
  workingLabel,
  cancelLabel,
  pending = false,
  blocked = false,
  error,
  onConfirm,
  onClose,
}: ConfirmActionProps) {
  const words = useMessages().dialog
  // Open, held by the page or by the dialog (useControllableState); what closes it tells onOpenChange and onClose, never
  // while what it confirms is under way.
  const [shown, setShown] = useControllableState(open, defaultOpen, onOpenChange)
  const close = () => {
    setShown(false)
    onClose?.()
  }
  return (
    <SettleModal
      open={shown}
      onOpenChange={(next) => {
        if (!next && !pending) close()
      }}
      title={title}
      closeOnBackdrop={!pending}
      showCloseButton={!pending}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={close} disabled={pending}>
            {cancelLabel ?? words.cancel}
          </Button>
          {gesture === 'button' && (
            <Button size="sm" pending={pending} disabled={blocked} onClick={onConfirm}>
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
            key={`${shown}-${error ?? ''}`}
            label={confirmLabel}
            confirmedLabel={pending ? (workingLabel ?? words.working) : (doneLabel ?? words.done)}
            tone="warning"
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
