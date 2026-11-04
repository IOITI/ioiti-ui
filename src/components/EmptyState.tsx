import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

interface EmptyStateProps {
  /** What would be there, as an icon of lucide-react: `<Inbox />`. */
  icon?: ReactNode
  /** What there is not: "No detection rule yet". */
  title: ReactNode
  /** The level of its heading, one under what holds it: 2 under the page's (3 when `compact`, under a panel's). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Why, and what would bring something. */
  description?: ReactNode
  /** What to do about it: a `Button` for an action, a `ButtonLink` for a page, or a few. */
  actions?: ReactNode
  /** Smaller and closer: inside a `Panel`, or across the columns of a table's body. */
  compact?: boolean
  className?: string
}

/**
 * What a page, a panel or a table says when it has nothing to show, and the way to something: an icon, what
 * there is not under a heading, why, and what to do about it. For one quiet line, `EmptyText`.
 */
export function EmptyState({ icon, title, headingLevel, description, actions, compact = false, className }: EmptyStateProps) {
  const Heading = `h${headingLevel ?? (compact ? 3 : 2)}` as const
  return (
    // Its words wrap, in a table whose cells keep theirs on one line too.
    <div className={cn('flex flex-col items-center whitespace-normal text-center', compact ? 'gap-1 px-4 py-6' : 'gap-1.5 px-6 py-12', className)}>
      {icon && (
        <div
          aria-hidden
          className={cn(
            'grid place-items-center rounded-xl border border-border bg-surface-raised text-muted-foreground',
            compact ? 'mb-2 size-8 [&>svg]:size-4' : 'mb-3 size-10 [&>svg]:size-5',
          )}
        >
          {icon}
        </div>
      )}
      <Heading className={cn('text-foreground', compact ? 'text-sm font-medium' : 'text-base font-semibold')}>{title}</Heading>
      {description && <p className={cn('text-muted-foreground', compact ? 'max-w-sm text-xs' : 'max-w-md text-sm')}>{description}</p>}
      {actions && <div className={cn('flex flex-wrap items-center justify-center gap-2', compact ? 'mt-3' : 'mt-4')}>{actions}</div>}
    </div>
  )
}
