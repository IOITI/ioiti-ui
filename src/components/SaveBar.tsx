import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useId, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { announce } from '../lib/announce.js'
import { deprecated } from '../lib/deprecated.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { TOAST } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'
import { useMessages } from './locale-context.js'
import { ToastInsetContext } from './toast-context.js'
import { Button } from './ui/button.js'

interface SaveBarProps {
  /** Shown while there is something to save. */
  open: boolean
  /** What there is to save: "3 unsaved changes"; the provider's language's "Unsaved changes" by default. */
  message?: ReactNode
  onSave: () => void
  /** Gives up the changes; no Discard button without it. */
  onDiscard?: () => void
  /** The save is on its way: Save says so, and neither Save nor Discard can be pressed meanwhile. */
  pending?: boolean
  /** @deprecated Use `pending`. Removed in 1.0. */
  saving?: boolean
  /** Save cannot be pressed: what there is to save is not valid yet (say why in `error`). */
  saveDisabled?: boolean
  /** Why it cannot be saved, or why the last save failed: said at once to a screen reader. */
  error?: ReactNode
  /** The Save button's words; the provider's language's by default ("Save"). */
  saveLabel?: string
  /** The Discard button's words; the provider's language's by default ("Discard"). */
  discardLabel?: string
  /** Other actions, before Discard and Save. */
  children?: ReactNode
  /** Its name for a screen reader; the provider's language's by default ("Unsaved changes"). */
  label?: string
  className?: string
}

/**
 * The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, and
 * Discard and Save. It stays in sight as the page scrolls, the toasts rising above it; a screen reader
 * hears it once when it comes. With `RouterLeaveGuard`, leaving the page asks first. As Elastic UI's
 * bottom bar does.
 */
export function SaveBar({
  open,
  message: givenMessage,
  onSave,
  onDiscard,
  pending: givenPending,
  saving,
  saveDisabled = false,
  error,
  saveLabel: givenSaveLabel,
  discardLabel: givenDiscardLabel,
  children,
  label: givenLabel,
  className,
}: SaveBarProps) {
  // Its former name read as today's, said once in development.
  if (saving !== undefined) deprecated('save-bar-saving', 'SaveBar')
  const pending = givenPending ?? saving ?? false
  // Its words the provider's language's, its own props given over them.
  const words = useMessages().field
  // A `null` given says nothing, as it did.
  const message = givenMessage === undefined ? words.unsavedChanges : givenMessage
  const saveLabel = givenSaveLabel ?? words.save
  const discardLabel = givenDiscardLabel ?? words.discard
  const label = givenLabel ?? words.unsavedChanges
  const key = useId()
  const bar = useRef<HTMLDivElement>(null)
  const lift = useContext(ToastInsetContext)

  // The toasts clear it while it is there.
  useLayoutEffect(() => {
    if (!lift) return
    lift(key, open ? (bar.current?.offsetHeight ?? 56) + 16 : 0)
    return () => lift(key, 0)
  }, [lift, key, open])

  // Said once as it comes, not again at each change counted.
  const said = typeof message === 'string' ? message : label
  const saidRef = useRef(said)
  useEffect(() => {
    saidRef.current = said
  })
  useEffect(() => {
    if (open) announce(saidRef.current)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={bar}
          role="region"
          aria-label={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16, transition: motionTransitions.easeExit }}
          transition={motionTransitions.springSheet}
          className={cn(
            // A bar that floats over the page: a toast's surface and padding.
            TOAST,
            'sticky bottom-4 z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 p-4',
            className,
          )}
        >
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-foreground">{message}</p>
            {error && (
              <p role="alert" className="text-xs text-negative">
                {error}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {children}
            {onDiscard && (
              <Button variant="ghost" size="sm" onClick={onDiscard} disabled={pending}>
                {discardLabel}
              </Button>
            )}
            <Button size="sm" onClick={onSave} pending={pending} loadingText={words.saving} disabled={saveDisabled}>
              {saveLabel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
