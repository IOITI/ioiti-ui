import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

export interface Change {
  /** What changes: a setting, a field. */
  label: ReactNode
  /** Its value before; none for what is added. */
  before?: ReactNode
  /** Its value after; none for what is removed. */
  after?: ReactNode
  /** Why, or what it does. */
  note?: ReactNode
}

export interface ChangeGroup {
  title: ReactNode
  changes: Change[]
}

interface ChangeListProps {
  /** The changes, or `groups` of them under their titles. */
  changes?: Change[]
  groups?: ChangeGroup[]
  /** The list's name for a screen reader: "Changes to apply". */
  label?: string
  /** The values as figures: digits of one width. */
  numeric?: boolean
  className?: string
}

function Row({ change, numeric }: { change: Change; numeric: boolean }) {
  const added = change.before === undefined || change.before === null
  const removed = change.after === undefined || change.after === null
  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2">
      <span className="min-w-0 text-text-secondary">{change.label}</span>
      <span className={cn('ml-auto inline-flex flex-wrap items-baseline justify-end gap-x-2', numeric && 'tabular-nums')}>
        {added ? (
          <span className="text-xs text-text-muted">New</span>
        ) : (
          <del className="text-text-muted decoration-text-muted">
            <span className="sr-only">from </span>
            {change.before}
          </del>
        )}
        <ArrowRight aria-hidden className="size-3.5 shrink-0 self-center text-text-muted" />
        {removed ? (
          <span className="text-text-muted">Removed</span>
        ) : (
          <ins className="font-medium text-text-primary no-underline">
            <span className="sr-only">to </span>
            {change.after}
          </ins>
        )}
      </span>
      {change.note && <p className="w-full text-xs text-muted-foreground">{change.note}</p>}
    </li>
  )
}

/**
 * What changes, each from its value before to its value after: a configuration about to be applied, a
 * record edited, a run compared with the last. Screen readers hear "from … to …".
 */
export function ChangeList({ changes = [], groups, label, numeric = false, className }: ChangeListProps) {
  if (groups) {
    return (
      <div aria-label={label} role={label ? 'group' : undefined} className={cn('flex flex-col gap-4 text-sm', className)}>
        {groups.map((group, index) => (
          <section key={index}>
            <h4 className="mb-1 text-xs font-medium text-text-secondary">{group.title}</h4>
            <ul className="divide-y divide-border">
              {group.changes.map((change, at) => (
                <Row key={at} change={change} numeric={numeric} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    )
  }
  return (
    <ul aria-label={label} className={cn('divide-y divide-border text-sm', className)}>
      {changes.map((change, index) => (
        <Row key={index} change={change} numeric={numeric} />
      ))}
    </ul>
  )
}
