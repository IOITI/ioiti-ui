import { LinkProvider, TextLink } from 'ioiti-ui'
import { forwardRef, useMemo, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [went, setWent] = useState<string | null>(null)
  // The frame has no router: a link says where it leads instead of leaving.
  const Link = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(function Link({ href, onClick, ...props }, ref) {
        return (
          <a
            ref={ref}
            href={href}
            onClick={(event) => {
              onClick?.(event)
              event.preventDefault()
              setWent(href)
            }}
            {...props}
          />
        )
      }),
    [],
  )
  return (
    <LinkProvider component={Link} navigate={(to) => setWent(String(to))}>
      <div className="flex flex-col items-start gap-3 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm">
            Read <TextLink to="/foundations/usable-by-all">the rules</TextLink> before writing a page.
          </p>
          <TextLink to="/components/tables" variant="hover" className="text-sm font-medium">
            Order 2026-0042
          </TextLink>
          <TextLink to="/components/tables" variant="quiet">
            View all
          </TextLink>
        </div>
        <p className="text-xs text-muted-foreground">
          {went ? `The router goes to ${went}.` : 'Inline, underlined in text; hover, underlined under the pointer; quiet, a panel’s way further.'}
        </p>
      </div>
    </LinkProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
