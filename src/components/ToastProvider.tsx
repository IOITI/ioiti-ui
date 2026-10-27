import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { VelocityToast } from './ui/velocity-toast.js'

import { ToastContext } from './toast-context.js'
import type { ShowToast, ToastMessage } from './toast-context.js'

/** Beyond this, the oldest waiting toasts are dropped: a burst must not take minutes to read out. */
const MAX_WAITING = 6


interface QueuedToast extends ToastMessage {
  id: number
}

function displayTime(toast: QueuedToast, waiting: number): number {
  if (toast.variant === 'error') return 8000
  // Others are waiting behind it: move along faster.
  return waiting > 0 ? 2500 : 4000
}

interface ToastProviderProps {
  /**
   * Classes of the toast's frame, to move it: above a bar fixed at the bottom of a page
   * (`bottom-20`), for instance.
   */
  wrapperClassName?: string
  children: ReactNode
}

/**
 * Toasts are shown one at a time, each for its full time. Two things happening
 * at once (an action's result and the event it caused) are shown one after the
 * other rather than the second replacing the first.
 *
 * Bottom centre: where pages put no control. Bottom right is where the buttons
 * that save and the paging of tables are; top right, the date ranges and the
 * exports.
 */
export function ToastProvider({ wrapperClassName, children }: ToastProviderProps) {
  const [queue, setQueue] = useState<QueuedToast[]>([])
  // The toast shown, once dismissed: it leaves, its exit played, before the next one comes.
  const [leaving, setLeaving] = useState<number | null>(null)
  const nextId = useRef(0)

  const show = useCallback<ShowToast>((message) => {
    nextId.current += 1
    const toast = { ...message, id: nextId.current }
    setQueue((waiting) => [...waiting, toast].slice(-MAX_WAITING))
  }, [])

  const current = queue[0]

  return (
    <ToastContext.Provider value={show}>
      {children}
      {current && (
        <VelocityToast
          key={current.id}
          open={leaving !== current.id}
          onDismiss={() => setLeaving(current.id)}
          onExitComplete={() => {
            setQueue((waiting) => waiting.filter((toast) => toast.id !== current.id))
            setLeaving(null)
          }}
          title={current.title}
          description={current.description}
          variant={current.variant ?? 'default'}
          position="bottom-center"
          // The frame stays above the page while a page changes, as every layer over it (over-page, motion.css).
          wrapperClassName={cn('over-page', wrapperClassName)}
          duration={displayTime(current, queue.length - 1)}
        />
      )}
    </ToastContext.Provider>
  )
}
