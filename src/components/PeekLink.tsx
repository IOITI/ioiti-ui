import type { ReactNode } from 'react'

import { useLinkComponent } from './link-context.js'
import { PeekCard } from './ui/peek-card.js'

interface PeekLinkProps {
  to: string
  /** What the card shows, read once it opens. */
  content: () => ReactNode
  className?: string
  children: ReactNode
  /** False: a tap follows the link at once, the card being for a pointer and the keyboard only. */
  openOnTap?: boolean
  'aria-label'?: string
}

/**
 * A link whose page is previewed on hover, on keyboard focus and on a first tap: what it leads to,
 * without leaving the page. It stays a link, which a click (and a second tap) follows.
 */
export function PeekLink({ to, content, className, children, openOnTap = true, 'aria-label': label }: PeekLinkProps) {
  const Link = useLinkComponent()
  return (
    <PeekCard renderContent={content} href={to} openOnTap={openOnTap}>
      {/* The application's link, held in context (LinkProvider): the same component at every render. */}
      {/* oxlint-disable-next-line react/static-components */}
      <Link href={to} className={className} aria-label={label}>
        {children}
      </Link>
    </PeekCard>
  )
}
