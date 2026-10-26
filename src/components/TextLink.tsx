import type { ComponentProps } from 'react'

import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'

const LOOK = {
  /** In running text: underlined. */
  inline: 'underline underline-offset-2',
  /** In a list or a table, where every name is a link: underlined under the pointer. */
  hover: 'underline-offset-2 hover:underline',
  /** A panel's own way further ("View all"): small and quiet until hovered. */
  quiet: 'text-xs text-muted-foreground hover:text-foreground',
}

interface TextLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  /** Where it leads. */
  to: string
  variant?: keyof typeof LOOK
}

/** A link made of words, drawn by the application's link (LinkProvider): opened in another tab with ⌘ or Ctrl. */
export function TextLink({ to, variant = 'inline', className, ...props }: TextLinkProps) {
  const Link = useLinkComponent()
  return (
    // The application's link, held in context (LinkProvider): the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link href={to} className={cn(LOOK[variant], className)} {...props} />
  )
}
