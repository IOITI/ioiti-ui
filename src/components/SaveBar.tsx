import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useId, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { announce } from '../lib/announce.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { cn } from '../lib/utils.js'
import { ToastInsetContext } from './toast-context.js'
import { Button } from './ui/button.js'

interface SaveBarProps {
  /** Shown while there is something to save. */
  open: boolean
  /** What there is to save: "3 unsaved changes". */
  message?: ReactNode
  onSave: () => void
  /** Gives up the changes; no Discard button without it. */
  onDiscard?: () => void
  /** The save is on its way. */
  saving?: boolean
  /** Save cannot be pressed: what there is to save is not valid yet (say why in `error`). */
  saveDisabled?: boolean
  /** Why it cannot be saved, or why the last save failed: said at once to a screen reader. */
  error?: ReactNode
  saveLabel?: string
  discardLabel?: string
  /** Other actions, before Discard and Save. */
  children?: ReactNode
  /** Its name for a screen reader. */
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
  message = 'Unsaved changes',
  onSave,
  onDiscard,
  saving = false,
  saveDisabled = false,
  error,
  saveLabel = 'Save',
  discardLabel = 'Discard',
  children,
  label = 'Unsaved changes',
  className,
}: SaveBarProps) {
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
            'sticky bottom-4 z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg glass-float',
            className,
          )}
        >
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-text-primary">{message}</p>
            {error && (
              <p role="alert" className="text-xs text-negative">
                {error}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {children}
            {onDiscard && (
              <Button variant="ghost" size="sm" onClick={onDiscard} disabled={saving}>
                {discardLabel}
              </Button>
            )}
            <Button size="sm" onClick={onSave} isLoading={saving} loadingText="Saving" disabled={saveDisabled}>
              {saveLabel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
