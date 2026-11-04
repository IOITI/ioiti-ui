import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import type { MouseEvent, ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { isPlainClick } from '../lib/links.js'
import { cn } from '../lib/utils.js'
import { ButtonLink } from './ButtonLink.js'
import { Hint } from './Hint.js'
import type { ButtonVariant } from './ui/button.js'

/** A way to sign in through another service, an identity provider (single sign-on). */
export interface SignInProvider {
  /** Tells it from the others: what `pending` holds and `onPendingChange` gives. */
  id: string
  /** What its button says: "Sign in with Gitea". */
  label: ReactNode
  /**
   * The server's address that sends the browser on to the provider and takes it back
   * (`/api/v1/auth/oidc/gitea/login?next=/w/main`): its page is loaded from the server, never through the router.
   */
  href: string
  /** Its mark, before the label: an icon, or the provider's logo (`alt=""`: the label names it). */
  icon?: ReactNode
  /** It cannot be used now: `hint` says why. */
  disabled?: boolean
  /** On hover, keyboard focus and a tap, and read by screen readers: what it signs in with, or why it cannot. */
  hint?: ReactNode
}

interface SignInProvidersProps {
  /** A button the whole width for each, in this order. Without any, the form alone. */
  providers: SignInProvider[]
  /** The form of a password, beside the providers, a line between. */
  children?: ReactNode
  /** Where the providers stand: before the form, or after it. */
  placement?: 'before' | 'after'
  /** The words on the line between the providers and the form; `''` for a line without words, `null` for none. */
  divider?: ReactNode
  /**
   * The provider the browser is on its way to, by its id: its button busy, the others disabled. Any other id (the
   * form's own, while it is sent) leaves them all disabled; `null`, none. Left to the component when not given:
   * a plain click on one marks it (one with ⌘ or Ctrl, which opens another tab, does not).
   */
  pending?: string | null
  /**
   * Told of the provider chosen (its id), so that the form can wait too; and of `null` when the page comes back
   * from the browser's history (Back, from the provider's page) with nothing on its way any more.
   */
  onPendingChange?: (id: string | null) => void
  /** The providers' name for a screen reader. */
  label?: string
  /** The look of their buttons. */
  variant?: ButtonVariant
  className?: string
}

/**
 * The ways to sign in through an identity provider (single sign-on), beside the form of a password: a button the
 * whole width for each, which leads to the server's address for it. Its page is loaded from the server, never
 * through the router: the server sends the browser on to the provider. Once one is chosen, its button is busy
 * and the others are disabled until the browser has left; back from the browser's history, they are as they were.
 */
export function SignInProviders({
  providers,
  children,
  placement = 'before',
  divider = 'or',
  pending,
  onPendingChange,
  label = 'Single sign-on',
  variant = 'outline',
  className,
}: SignInProvidersProps) {
  const [current, setCurrent] = useControllableState<string | null>(pending, null, onPendingChange)

  // The page left for a provider may come back whole from the browser's history (its back-forward cache), as it
  // was when it was left: nothing is on its way any more.
  useEffect(() => {
    if (current === null) return
    const shown = (event: PageTransitionEvent) => {
      if (event.persisted) setCurrent(null)
    }
    window.addEventListener('pageshow', shown)
    return () => window.removeEventListener('pageshow', shown)
  }, [current, setCurrent])

  const list = providers.length > 0 && (
    <ul aria-label={label} className="flex flex-col gap-2">
      {providers.map((provider) => {
        const busy = provider.id === current
        const disabled = Boolean(provider.disabled) || (current !== null && !busy)
        return (
          <li key={provider.id}>
            {/* The whole width, wrapped (a disabled button's hint is on its wrapper) or not. */}
            <Hint content={provider.hint} wrap={disabled} className="flex w-full *:flex-1">
              {/* Busy, it stays the link it was: the browser follows a link only while it is in the page. */}
              <ButtonLink
                to={disabled ? null : provider.href}
                reloadDocument
                variant={variant}
                leftIcon={busy ? <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden /> : provider.icon}
                aria-disabled={busy || undefined}
                aria-busy={busy || undefined}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  // On its way already: once is enough.
                  if (busy) event.preventDefault()
                  else if (!event.defaultPrevented && isPlainClick(event)) setCurrent(provider.id)
                }}
                className={cn('w-full', busy && 'cursor-not-allowed opacity-30')}
              >
                {provider.label}
              </ButtonLink>
            </Hint>
          </li>
        )
      })}
    </ul>
  )
  const line = list && children && divider !== null && divider !== false && <Divider>{divider}</Divider>

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {placement === 'before' ? list : children}
      {line}
      {placement === 'before' ? children : list}
    </div>
  )
}

/** A line across, its words in the middle, read between the providers and the form. */
function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span aria-hidden className="h-px flex-1 bg-border" />
      {children !== '' && (
        <>
          {children}
          <span aria-hidden className="h-px flex-1 bg-border" />
        </>
      )}
    </div>
  )
}
