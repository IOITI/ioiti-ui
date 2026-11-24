import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { prepareLiveRegions } from '../lib/announce.js'
import type { StatusTone } from '../lib/tones.js'
import { cn } from '../lib/utils.js'
import { VelocityToast } from './ui/velocity-toast.js'

import { ToastContext, ToastInsetContext, ToastRegionContext, toastTone } from './toast-context.js'
import type { ShowToast, ToastMessage } from './toast-context.js'

/** Beyond this, the oldest waiting toasts are dropped: a burst must not take minutes to read out. */
const MAX_WAITING = 6


/** A toast waiting its turn: its tone read once, as it was shown (a former `variant` too). */
interface QueuedToast extends Omit<ToastMessage, 'tone' | 'variant'> {
  id: number
  tone: StatusTone
}

function displayTime(toast: QueuedToast, waiting: number): number {
  // What went wrong: the time to read it, and to act on it.
  if (toast.tone === 'danger') return 8000
  // Something to do from it: the time to read it and reach its action, others waiting or not.
  if (toast.action) return 6000
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

  const show = useCallback<ShowToast>(({ tone, variant, ...message }) => {
    nextId.current += 1
    const toast = { ...message, tone: toastTone(tone, variant, 'useToast'), id: nextId.current }
    setQueue((waiting) => [...waiting, toast].slice(-MAX_WAITING))
  }, [])

  const current = queue[0]

  // The live regions what a control says is said in (announce.ts: "Copied", "3 unsaved changes"), there before the
  // first words: words put in a region as it is made are missed by some screen readers. A toast is said in its frame.
  useEffect(() => {
    prepareLiveRegions()
  }, [])

  // Lifted above what sits at the bottom of the page, as long as it is there.
  const [insets, setInsets] = useState<Record<string, number>>({})
  const setInset = useCallback((key: string, inset: number) => {
    setInsets((now) => (now[key] === inset ? now : { ...now, [key]: inset }))
  }, [])
  const lift = Math.max(0, ...Object.values(insets))
  const urgent = current?.tone === 'danger'
  const toast = current && (
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
      action={current.action}
      tone={current.tone}
      position="bottom-center"
      // The frame stays above the page while a page changes, as every layer over it (over-page, motion.css).
      wrapperClassName={cn('over-page motion-safe:transition-[margin-bottom] motion-safe:duration-300 motion-safe:ease-soft', wrapperClassName)}
      wrapperStyle={lift ? { marginBottom: lift } : undefined}
      duration={displayTime(current, queue.length - 1)}
    />
  )

  return (
    <ToastContext.Provider value={show}>
      <ToastInsetContext.Provider value={setInset}>{children}</ToastInsetContext.Provider>
      {/* The live regions the toasts are said in, there from the start: a toast put in a region made with it is missed
          by some screen readers. Politely, or at once for what went wrong. */}
      <ToastRegionContext.Provider value={true}>
        <div role="status">{current && !urgent && toast}</div>
        <div role="alert">{current && urgent && toast}</div>
      </ToastRegionContext.Provider>
    </ToastContext.Provider>
  )
}
