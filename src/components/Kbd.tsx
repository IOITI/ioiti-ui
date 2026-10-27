import type { ReactNode } from 'react'

import { keyLabels } from '../lib/keys.js'
import { cn } from '../lib/utils.js'

interface KbdProps {
  /**
   * The keys of a shortcut, as `useShortcut` takes them: `mod+k` (⌘K on an Apple computer, Ctrl K
   * elsewhere), `shift+?`, `g o` (G, then O).
   */
  keys?: string
  /** A key named as it is, where there are no `keys`: `<Kbd>Esc</Kbd>`. */
  children?: ReactNode
  className?: string
}

const CAP =
  'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-sans text-[11px] font-medium leading-none text-text-secondary shadow-[inset_0_-1px_0_var(--border)]'

/** A key to press, or the keys of a shortcut, as this computer writes them. */
export function Kbd({ keys, children, className }: KbdProps) {
  if (keys === undefined) return <kbd className={cn(CAP, className)}>{children}</kbd>
  const strokes = keyLabels(keys)
  return (
    <kbd className={cn('inline-flex items-center gap-1 align-middle', className)}>
      {strokes.map((stroke, index) => (
        <span key={index} className="inline-flex items-center gap-0.5">
          {index > 0 && (
            <span className="mr-0.5 text-[11px] text-text-muted">
              <span aria-hidden>·</span>
              <span className="sr-only">then</span>
            </span>
          )}
          {stroke.map((label, at) => (
            <kbd key={at} className={CAP}>
              {label.spoken ? (
                <>
                  <span aria-hidden>{label.shown}</span>
                  <span className="sr-only">{label.spoken}</span>
                </>
              ) : (
                label.shown
              )}
            </kbd>
          ))}
        </span>
      ))}
    </kbd>
  )
}
