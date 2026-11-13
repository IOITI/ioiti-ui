import { ButtonLink, LinkProvider } from 'ioiti-ui'
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
          <ButtonLink to="/components/forms">Go to the forms</ButtonLink>
          <ButtonLink to="/components/data" variant="outline" size="sm">
            Data display
          </ButtonLink>
          <ButtonLink to={null} variant="outline" size="sm">
            No day before the first
          </ButtonLink>
        </div>
        <p className="text-xs text-muted-foreground">
          {went ? `The router goes to ${went}.` : 'Each is a link: pressed, the router follows it; with ⌘ or Ctrl, it opens in another tab.'}
        </p>
      </div>
    </LinkProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
