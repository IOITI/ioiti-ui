import type { ReactNode } from 'react'

import { Hint } from '../components/Hint.js'
import { useLinkComponent } from '../components/link-context.js'
import { cn } from '../lib/utils.js'

// The 400 steps are made for a dark surface; on a light one the 800 steps carry the text.
const CHIP_TONE = {
  warning: 'bg-amber-500/15 text-amber-800 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20',
  danger: 'bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400',
}

interface StateChipProps {
  /** The page where it is dealt with. */
  to: string
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
export function StateChip({ to, tone, icon, label, hint }: StateChipProps) {
  const Link = useLinkComponent()
  return (
    <Hint content={hint} side="bottom">
      {/* The application's link, held in context (LinkProvider): the same component at every render. */}
      {/* oxlint-disable-next-line react/static-components */}
      <Link
        href={to}
        aria-label={label}
        className={cn(
          'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors lg:px-2.5',
          CHIP_TONE[tone],
        )}
      >
        {icon}
        <span className="hidden lg:inline">{label}</span>
      </Link>
    </Hint>
  )
}
