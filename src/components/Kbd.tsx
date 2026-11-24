import type { ReactNode } from 'react'

import { keyLabels } from '../lib/keys.js'
import { cn } from '../lib/utils.js'
import { useMessages } from './locale-context.js'

interface KbdProps {
  /**
   * The keys of a shortcut, as `useShortcut` takes them: `mod+k` (⌘K on an Apple computer, Ctrl K
   * elsewhere), `shift+?`, `g o` (G, then O).
   */
  keys?: string
  /** A key named as it is, where there are no `keys`: `<Kbd>Esc</Kbd>` (`keys="escape"` names it in the provider's language). */
  children?: ReactNode
  className?: string
}

const CAP =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border bg-surface px-1 font-sans text-[11px] font-medium leading-none text-text-secondary shadow-[inset_0_-1px_0_var(--border)]'

/**
 * A key to press, or the keys of a shortcut, as this computer writes them, named in the provider's language (« Maj »,
 * « Échap »): Apple's symbols stay symbols, said in its words.
 */
export function Kbd({ keys, children, className }: KbdProps) {
  const words = useMessages().keys
  if (keys === undefined) return <kbd className={cn(CAP, className)}>{children}</kbd>
  const strokes = keyLabels(keys, undefined, words)
  return (
    <kbd className={cn('inline-flex items-center gap-1 align-middle font-sans', className)}>
      {strokes.map((stroke, index) => (
        <span key={index} className="inline-flex items-center gap-0.5">
          {index > 0 && (
            <span className="mr-0.5 text-[11px] text-muted-foreground">
              <span aria-hidden>·</span>
              <span className="sr-only">{words.then}</span>
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
