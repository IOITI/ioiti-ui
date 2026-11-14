import { isPlainClick, LinkProvider, PageTrailProvider, TopBarTrail, useNavigateTo, usePageName } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: ['Customers'],
  entries: [{ id: 'accounts', path: '/customers', label: 'Accounts', section: 'Customers' }],
}

/** A page without a PageHeader names itself for the trail: its name, and the pages between. */
function InvoicePage() {
  usePageName('Invoice 2026-0042 of the spring catalogue print run', [
    { label: 'Acme Industrial Supplies (1024)', href: '/customers/1024' },
    { label: 'Invoices', href: '/customers/1024/invoices' },
  ])
  return null
}

/** The example's own link: a plain click says where it leads (LinkProvider's `navigate`) instead of going. */
function ExampleLink({ href = '', onClick, ...props }: ComponentProps<'a'>) {
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

const BAR = 'flex h-14 items-center rounded-xl border border-border px-4 glass-bar'

export default function TopBarTrailNarrow() {
  const [followed, setFollowed] = useState<string | null>(null)
  return (
    <LinkProvider component={ExampleLink} navigate={(to) => setFollowed(String(to))}>
      <PageTrailProvider menu={MENU} pathname="/customers/1024/invoices/2026-0042">
        <InvoicePage />
        <div className="flex flex-col gap-3">
          <div className={BAR}>
            <TopBarTrail home={{ label: 'Workspace', href: '/' }} />
          </div>
          <div className={`${BAR} w-80 max-w-full`}>
            <TopBarTrail home={{ label: 'Workspace', href: '/' }} />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Followed: <span className="font-mono text-foreground">{followed ?? 'nothing yet'}</span>
          </p>
        </div>
      </PageTrailProvider>
    </LinkProvider>
  )
}
