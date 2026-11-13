import { summariseStatusHistory } from '../lib/status-history.js'
import type { StatusHistorySlot, StatusHistoryUnit } from '../lib/status-history.js'
import type { HealthStatus } from '../lib/health.js'
import { cn } from '../lib/utils.js'

// The tones keep their colours, in every accent.
const BLOCK: Record<HealthStatus, string> = {
  ok: 'bg-positive',
  warning: 'bg-warning',
  down: 'bg-negative',
  unknown: 'bg-foreground/15',
  disabled: 'bg-foreground/10',
}

export interface StatusHistoryProps {
  /** One slot of time each, the oldest first. */
  slots: StatusHistorySlot[]
  /** What the strip is the history of ("API, the last 24 hours"): its name for a screen reader. */
  label: string
  /** What one slot is called, and more than one: hour and hours by default. */
  unit?: StatusHistoryUnit
  /** The strip in words, in place of the one written from its slots ("23 hours up, 1 degraded at 14:00"). */
  summary?: string
  /** What its two ends stand for, written under it ("24 h ago", "Now"). */
  scale?: [string, string]
  className?: string
}

/**
 * The uptime strip: one block per slot of time, coloured by its state, and the whole said in words for a
 * screen reader, which reads the strip as one picture. The colours are never alone: the words carry them.
 */
export function StatusHistory({ slots, label, unit, summary, scale, className }: StatusHistoryProps) {
  const said = summary ?? summariseStatusHistory(slots, unit)
  return (
    <div className={cn('min-w-0', className)}>
      <div role="img" aria-label={`${label}: ${said}`} className="flex h-8 gap-[2px]">
        {slots.map((slot, index) => (
          <span key={`${slot.at}-${index}`} className={cn('min-w-[2px] flex-1 rounded-[3px]', BLOCK[slot.status])} />
        ))}
      </div>
      {scale && (
        <div aria-hidden className="mt-1.5 flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </div>
      )}
    </div>
  )
}
