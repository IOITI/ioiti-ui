import type { ComponentProps, ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'
import { Button, buttonClassName } from './ui/button.js'
import type { ButtonSize, ButtonVariant } from './ui/button.js'

interface ButtonLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'className'> {
  /** Where it leads. Nothing: a button that cannot be pressed, there being nowhere to go (no day before the first). */
  to: string | null | undefined
  /**
   * Its page is loaded from the server: a plain `<a>`, not the application's link. For an address the server
   * answers, which the router would look for among the application's own pages and not find: a sign-in that
   * sends the browser on to an identity provider (`/api/v1/auth/oidc/gitea/login?next=/w/main`), a file, another
   * application on the same site. The address is followed as written, without the router's base path.
   */
  reloadDocument?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}

/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider), or by a plain `<a>` for a page the server answers (`reloadDocument`).
 */
export function ButtonLink({
  to,
  reloadDocument = false,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const Link = useLinkComponent(reloadDocument ? 'a' : undefined)
  if (!to) {
    return (
      <Button variant={variant} size={size} leftIcon={leftIcon} rightIcon={rightIcon} className={className} disabled>
        {children}
      </Button>
    )
  }
  return (
    // Pressed, it gives as a Button does (its whileTap): the same scale, in CSS.
    // The application's link, held in context (LinkProvider), or `a`: the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link href={to} className={buttonClassName({ variant, size, className: cn('transition motion-safe:active:scale-[0.97]', className) })} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Link>
  )
}
