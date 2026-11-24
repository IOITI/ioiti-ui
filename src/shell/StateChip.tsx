import type { ReactNode } from 'react'

import { Hint } from '../components/Hint.js'
import { useLinkComponent } from '../components/link-context.js'
import { deprecated } from '../lib/deprecated.js'
import { TONE_SOFT } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'

// The design's tones (recipes.ts), their faint ground, a step stronger under the pointer: each word keeps 4.5:1 on both.
const CHIP_TONE = {
  warning: cn(TONE_SOFT.warning, 'hover:bg-warning/10 dark:hover:bg-warning/20'),
  danger: cn(TONE_SOFT.negative, 'hover:bg-negative/10 dark:hover:bg-negative/20'),
  // Good news not to miss either (approved, merged): still a link to where it goes on.
  success: cn(TONE_SOFT.positive, 'hover:bg-positive/10 dark:hover:bg-positive/20'),
}

interface StateChipProps {
  /** The page where it is dealt with. */
  href?: string
  /** @deprecated Use `href`. Removed in 1.0. */
  to?: string
  /** What it is: something to fix (danger), to watch (warning), or good news (success). */
  tone: keyof typeof CHIP_TONE
  icon: ReactNode
  label: string
  /** What it means and what to do, for the tooltip. */
  hint: ReactNode
}

/**
 * A state the user must not miss, on whichever page they are (in the top bar,
 * AppShell's `topBarChips`): shown only while it applies, and a link to the
 * page where it is dealt with. On a narrow screen the icon stays and the words
 * are its name; what it means is its hint.
 */
export function StateChip({ href, to, tone, icon, label, hint }: StateChipProps) {
  const Link = useLinkComponent()
  // Its former name read as today's, said once in development.
  if (to !== undefined) deprecated('link-to', 'StateChip')
  return (
    <Hint content={hint} side="bottom">
      {/* The application's link, held in context (LinkProvider): the same component at every render. */}
      {/* oxlint-disable-next-line react/static-components */}
      <Link
        href={href ?? to}
        aria-label={label}
        className={cn(
          'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors lg:px-2.5',
          CHIP_TONE[tone],
        )}
      >
        {icon}
        <span className="hidden lg:inline">{label}</span>
      </Link>
    </Hint>
  )
}
