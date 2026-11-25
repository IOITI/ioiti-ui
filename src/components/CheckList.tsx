import { CircleCheck, CircleDashed, CircleX } from 'lucide-react'

import type { Check, CheckState } from '../lib/checks.js'
import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'

const LOOK: Record<CheckState, { icon: typeof CircleCheck; className: string; said: string }> = {
  pass: { icon: CircleCheck, className: 'text-positive', said: 'Passed' },
  fail: { icon: CircleX, className: 'text-negative', said: 'Failed' },
  open: { icon: CircleDashed, className: 'text-muted-foreground', said: 'Not checked' },
}

/** The props of `CheckIcon`. */
export interface CheckIconProps {
  /** The outcome it draws: passed, failed or open. */
  state: CheckState
  /** Named for a screen reader; not where what it stands beside says it already. */
  named?: boolean
}

/** A check's outcome as an icon, named for a screen reader unless what it stands beside says it already. */
export function CheckIcon({ state, named = true }: CheckIconProps) {
  const Icon = LOOK[state].icon
  return (
    <Icon
      className={cn('mt-0.5 size-4 shrink-0', LOOK[state].className)}
      aria-label={named ? LOOK[state].said : undefined}
      aria-hidden={named ? undefined : true}
    />
  )
}

/** The props of `CheckList`. */
export interface CheckListProps<T extends Check = Check> {
  /** The checks, in the order shown: each its label, its outcome and what it found. */
  checks: readonly T[]
  /** The list's name for a screen reader: "Checks of the release". */
  label: string
  /** Where a check leads, to what says more of it; `null` where it leads nowhere. */
  hrefOf?: (check: T) => string | null
  className?: string
}

/**
 * Checks and what each found, an icon telling passed, failed and open apart (and
 * named for a screen reader). A check with an address leads to what says more of it.
 */
export function CheckList<T extends Check>({ checks, label, hrefOf, className }: CheckListProps<T>) {
  const Link = useLinkComponent()
  return (
    <ul className={cn('grid gap-x-6 gap-y-2.5 text-sm', className)} aria-label={label}>
      {checks.map((check) => {
        const href = hrefOf?.(check) ?? null
        return (
          <li key={check.id} className="flex items-start gap-2">
            <CheckIcon state={check.state} />
            <div className="min-w-0">
              {href ? (
                <Link href={href} className="font-medium underline-offset-4 hover:underline">
                  {check.label}
                </Link>
              ) : (
                <span className="font-medium">{check.label}</span>
              )}
              <p className="text-xs text-muted-foreground">{check.detail}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
