import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

/** The props of `EmptyText`. */
export interface EmptyTextProps {
  className?: string
  /** What it says: "No run yet." */
  children: ReactNode
}

/** What a list or a panel says when it has nothing to show: one line, centred, quiet. */
export function EmptyText({ className, children }: EmptyTextProps) {
  return <p className={cn('py-6 text-center text-sm text-muted-foreground', className)}>{children}</p>
}

/** The props of `ErrorText`. */
export interface ErrorTextProps {
  className?: string
  /** What went wrong: "The run could not be stopped." */
  children: ReactNode
}

/** What went wrong with an action, where it was asked (under its button): read out at once. */
export function ErrorText({ className, children }: ErrorTextProps) {
  return (
    <p role="alert" className={cn('text-sm text-negative', className)}>
      {children}
    </p>
  )
}
