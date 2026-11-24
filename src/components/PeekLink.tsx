import type { ReactNode } from 'react'

import { deprecated } from '../lib/deprecated.js'
import { useLinkComponent } from './link-context.js'
import { PeekCard } from './ui/peek-card.js'

interface PeekLinkProps {
  /** Where it leads, and the card's own link. */
  href?: string
  /** @deprecated Use `href`. Removed in 1.0. */
  to?: string
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
export function PeekLink({ href: givenHref, to, content, className, children, openOnTap = true, 'aria-label': label }: PeekLinkProps) {
  const Link = useLinkComponent()
  // Its former name read as today's, said once in development.
  if (to !== undefined) deprecated('link-to', 'PeekLink')
  const href = givenHref ?? to
  return (
    <PeekCard renderContent={content} href={href} openOnTap={openOnTap}>
      {/* The application's link, held in context (LinkProvider): the same component at every render. */}
      {/* oxlint-disable-next-line react/static-components */}
      <Link href={href} className={className} aria-label={label}>
        {children}
      </Link>
    </PeekCard>
  )
}
