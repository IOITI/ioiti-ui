import { changeTone, changeWords, formatChange } from '../lib/change.js'
import type { ChangeTone, GoodWhen } from '../lib/change.js'
import { cn } from '../lib/utils.js'

const TONE_TEXT: Record<ChangeTone, string> = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: 'text-muted-foreground',
}

interface KpiChangeProps {
  change: number
  goodWhen?: GoodWhen
  /** Writes the change, signed: a percentage to one decimal by default. */
  format?: (change: number) => string
  className?: string
}

/**
 * A figure's change, signed, in the tone of what it means (good news, bad news), an arrow its way: seen as
 * "+2.5%", read as "up 2.5%". KpiTile's and KpiStrip's.
 */
export function KpiChange({ change, goodWhen = 'up', format = formatChange, className }: KpiChangeProps) {
  const tone = changeTone(change, goodWhen)
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium tabular-nums', TONE_TEXT[tone], className)}>
      {change !== 0 && Number.isFinite(change) && (
        <svg viewBox="0 0 10 10" className={cn('h-2 w-2 shrink-0', change < 0 && 'rotate-180')} fill="currentColor" aria-hidden>
          <path d="M5 1.5 9 7.5H1Z" />
        </svg>
      )}
      <span aria-hidden>{format(change)}</span>
      <span className="sr-only">{changeWords(change, format)}</span>
    </span>
  )
}
