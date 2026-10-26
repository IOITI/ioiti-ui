import type { ComponentProps, ReactNode } from 'react'

import { useLinkComponent } from './link-context.js'
import { Button, buttonClassName } from './ui/button.js'
import type { ButtonSize, ButtonVariant } from './ui/button.js'

interface ButtonLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'className'> {
  /** Where it leads. Nothing: a button that cannot be pressed, there being nowhere to go (no day before the first). */
  to: string | null | undefined
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}

/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider).
 */
export function ButtonLink({ to, variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, ...props }: ButtonLinkProps) {
  const Link = useLinkComponent()
  if (!to) {
    return (
      <Button variant={variant} size={size} leftIcon={leftIcon} rightIcon={rightIcon} className={className} disabled>
        {children}
      </Button>
    )
  }
  return (
    // The application's link, held in context (LinkProvider): the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link href={to} className={buttonClassName({ variant, size, className })} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Link>
  )
}
