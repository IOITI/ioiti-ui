import type { ComponentProps } from 'react'

import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'

const LOOK = {
  /** In running text: underlined, and in the accent where the theme has one. */
  inline: 'underline underline-offset-2 accent:text-brand-text',
  /** In a list or a table, where every name is a link: underlined under the pointer, in the accent then. */
  hover: 'underline-offset-2 hover:underline accent:hover:text-brand-text',
  /** A panel's own way further ("View all"): small and quiet until hovered. */
  quiet: 'text-xs text-muted-foreground hover:text-foreground accent:hover:text-brand-text',
}

interface TextLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  /** Where it leads. */
  to: string
  /**
   * Its page is loaded from the server: a plain `<a>`, not the application's link, as `ButtonLink`'s. For an
   * address the server answers and the router does not know (a sign-out, a file); followed as written.
   */
  reloadDocument?: boolean
  variant?: keyof typeof LOOK
}

/**
 * A link made of words, drawn by the application's link (LinkProvider), or by a plain `<a>` for a page the
 * server answers (`reloadDocument`): opened in another tab with ⌘ or Ctrl.
 */
export function TextLink({ to, reloadDocument = false, variant = 'inline', className, ...props }: TextLinkProps) {
  const Link = useLinkComponent(reloadDocument ? 'a' : undefined)
  return (
    // The application's link, held in context (LinkProvider), or `a`: the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link href={to} className={cn(LOOK[variant], className)} {...props} />
  )
}
