import { Breadcrumb, ButtonLink, isPlainClick, LinkProvider, TextLink, ThemeProvider, useNavigateTo } from 'ioiti-ui'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { ComponentProps } from 'react'

/**
 * The application's link: given `href` and the props of an `<a>`. A plain click follows it with `navigate`,
 * LinkProvider's; one with ⌘ or Ctrl is the browser's. Here its address is a part of this page, so that the
 * gallery stays where it is: an application's is the address itself (or the router's link, RouterLink).
 */
function FollowLink({ href = '', onClick, ...props }: ComponentProps<'a'>) {
  const navigate = useNavigateTo()
  return (
    <a
      {...props}
      href={`#${href}`}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !isPlainClick(event)) return
        event.preventDefault()
        navigate(href)
      }}
    />
  )
}

export default function IoitiProviderPartsAlone() {
  const [followed, setFollowed] = useState<string | null>(null)
  return (
    // The theme alone, kept under the application's key (the pre-paint script's): ThemeToggle and LookPicker read it.
    <ThemeProvider>
      <LinkProvider component={FollowLink} navigate={(to) => setFollowed(String(to))}>
        <div className="flex flex-col gap-4">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Orders', href: '/orders' }, { label: 'Order 2026-0042' }]} />
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink to="/orders/new" size="sm" leftIcon={<Plus />}>
              New order
            </ButtonLink>
            <TextLink to="/orders?status=late" className="text-sm">
              The late ones
            </TextLink>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Followed: <span className="font-mono text-foreground">{followed ?? 'nothing yet'}</span>
          </p>
        </div>
      </LinkProvider>
    </ThemeProvider>
  )
}
