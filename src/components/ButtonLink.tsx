import { Loader2 } from 'lucide-react'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'

import { deprecated } from '../lib/deprecated.js'
import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'
import { Button, BUTTON_LABEL_CLASS, buttonClassName, buttonIconClassName } from './ui/button.js'
import type { ButtonSize, ButtonVariant } from './ui/button.js'

interface ButtonLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'className'> {
  /**
   * Where it leads. Nothing (`null`, or none given): a button that cannot be pressed, there being nowhere to go (no day
   * before the first).
   */
  href?: string | null
  /** @deprecated Use `href`. Removed in 1.0. */
  to?: string | null
  /**
   * Its page is loaded from the server: a plain `<a>`, not the application's link. For an address the server
   * answers, which the router would look for among the application's own pages and not find: a sign-in that
   * sends the browser on to an identity provider (`/api/v1/auth/oidc/gitea/login?next=/w/main`), a file, another
   * application on the same site. The address is followed as written, without the router's base path.
   */
  reloadDocument?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  /**
   * On its way, as a `Button`'s: the browser sent on to where it leads (an identity provider). A spinner in place of
   * its icon, said busy, and a click does nothing meanwhile; it stays the link it is, which the browser follows.
   */
  pending?: boolean
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
  href,
  to,
  reloadDocument = false,
  variant: givenVariant = 'primary',
  size = 'md',
  pending = false,
  leftIcon,
  rightIcon,
  className,
  children,
  onClick,
  ...props
}: ButtonLinkProps) {
  const Link = useLinkComponent(reloadDocument ? 'a' : undefined)
  // Its former names read as today's, each said once in development.
  if (to !== undefined) deprecated('link-to', 'ButtonLink')
  if (givenVariant === 'destructive') deprecated('button-destructive', 'ButtonLink')
  const target = href === undefined ? to : href
  const variant = givenVariant === 'destructive' ? 'danger' : givenVariant
  if (!target) {
    return (
      <Button variant={variant} size={size} pending={pending} leftIcon={leftIcon} rightIcon={rightIcon} className={className} disabled>
        {children}
      </Button>
    )
  }
  return (
    // Pressed, it gives as a Button does (its whileTap): the same scale, in CSS.
    // The application's link, held in context (LinkProvider), or `a`: the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link
      href={target}
      className={buttonClassName({
        variant,
        size,
        // On its way, it looks as a pending Button does (DISABLED's half), and gives no more under a press.
        className: cn('transition', pending ? 'cursor-not-allowed opacity-50' : 'motion-safe:active:scale-[0.97]', className),
      })}
      aria-busy={pending || undefined}
      aria-disabled={pending || undefined}
      // On its way already: once is enough.
      onClick={pending ? (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault() : onClick}
      {...props}
    >
      {pending ? (
        <span className={buttonIconClassName(size)}>
          <Loader2 className="motion-safe:animate-spin" aria-hidden />
        </span>
      ) : (
        leftIcon && <span className={buttonIconClassName(size)}>{leftIcon}</span>
      )}
      {children && <span className={BUTTON_LABEL_CLASS}>{children}</span>}
      {!pending && rightIcon && <span className={buttonIconClassName(size)}>{rightIcon}</span>}
    </Link>
  )
}
