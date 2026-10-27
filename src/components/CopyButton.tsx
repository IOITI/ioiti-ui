import { Check, Copy, TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { announce } from '../lib/announce.js'
import { cn, copyToClipboard } from '../lib/utils.js'
import { Hint } from './Hint.js'

type Outcome = 'idle' | 'copied' | 'failed'

interface CopyButtonProps {
  /** What is copied, or a function giving it when the button is pressed. */
  value: string | (() => string)
  /** What it copies, in words: "Copy the key". */
  label?: string
  /** The label written beside the icon, not only in its hint. */
  showLabel?: boolean
  size?: 'sm' | 'md'
  /** Told whether the copy was made. */
  onCopy?: (copied: boolean) => void
  className?: string
}

const SAID: Record<Outcome, string> = { idle: '', copied: 'Copied', failed: "Couldn't copy" }

/** Copies a value to the clipboard, and says it did: a check for two seconds, and the words for a screen reader. */
export function CopyButton({ value, label = 'Copy', showLabel = false, size = 'md', onCopy, className }: CopyButtonProps) {
  const [outcome, setOutcome] = useState<Outcome>('idle')
  const button = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    const copied = await copyToClipboard(typeof value === 'function' ? value() : value).catch(() => false)
    // Where the clipboard is not given to the page, copying borrows the focus: it comes back here.
    button.current?.focus()
    setOutcome(copied ? 'copied' : 'failed')
    announce(copied ? SAID.copied : SAID.failed)
    onCopy?.(copied)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOutcome('idle'), 2000)
  }

  const icon =
    outcome === 'copied' ? (
      <Check className="text-positive" aria-hidden />
    ) : outcome === 'failed' ? (
      <TriangleAlert className="text-warning" aria-hidden />
    ) : (
      <Copy aria-hidden />
    )

  const drawn = (
    <button
      ref={button}
      type="button"
      aria-label={showLabel ? undefined : label}
      onClick={copy}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-text-secondary transition hover:bg-surface-hover hover:text-text-primary motion-safe:active:scale-95',
        size === 'sm' ? 'h-7 min-w-7 text-xs [&>svg]:size-3.5' : 'h-8 min-w-8 text-sm [&>svg]:size-4',
        showLabel && 'px-2',
        className,
      )}
    >
      {icon}
      {showLabel && <span>{outcome === 'idle' ? label : SAID[outcome]}</span>}
    </button>
  )

  // An icon alone has its hint: what it does, then what came of it. A label written beside it says both.
  return <Hint content={showLabel ? '' : outcome === 'idle' ? label : SAID[outcome]}>{drawn}</Hint>
}
