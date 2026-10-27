import { cn } from '../lib/utils.js'
import { CopyButton } from './CopyButton.js'
import { Hint } from './Hint.js'

interface CopyChipProps {
  /** What is shown and copied: a reference, a key, an address. */
  value: string
  /** What it is, for its button: "the key" makes "Copy the key". */
  label?: string
  /**
   * A long value cut short: in its `middle` (an identifier, whose ends tell it apart), at its `end`, or
   * not at all. The whole of it is in a hint, and a screen reader hears it.
   */
  truncate?: 'middle' | 'end' | false
  /** In the middle: the characters kept at its start and at its end. */
  keep?: { start: number; end: number }
  className?: string
}

/** A value to read and copy, in a chip with its copy button: a reference, an API key, a webhook's address. */
export function CopyChip({ value, label, truncate = false, keep = { start: 8, end: 6 }, className }: CopyChipProps) {
  const cut = truncate === 'middle' && value.length > keep.start + keep.end + 1
  const shown = cut ? `${value.slice(0, keep.start)}…${value.slice(-keep.end)}` : value
  const short = cut || truncate === 'end'
  const text = (
    <span className={cn('min-w-0 font-mono text-xs text-text-primary', truncate === 'end' ? 'truncate' : 'whitespace-nowrap')}>
      <span aria-hidden={cut || undefined}>{shown}</span>
      {cut && <span className="sr-only">{value}</span>}
    </span>
  )
  return (
    <span className={cn('inline-flex max-w-full items-center gap-0.5 rounded-md border border-border bg-surface py-0.5 pl-2 pr-0.5', className)}>
      {short ? (
        <Hint content={value} wrap className="min-w-0">
          {text}
        </Hint>
      ) : (
        text
      )}
      <CopyButton value={value} label={label ? `Copy ${label}` : 'Copy'} size="sm" />
    </span>
  )
}
