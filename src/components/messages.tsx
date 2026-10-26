import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

/** What a list or a panel says when it has nothing to show: one line, centred, quiet. */
export function EmptyText({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn('py-6 text-center text-sm text-muted-foreground', className)}>{children}</p>
}

/** What went wrong with an action, where it was asked (under its button): read out at once. */
export function ErrorText({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p role="alert" className={cn('text-sm text-negative', className)}>
      {children}
    </p>
  )
}
