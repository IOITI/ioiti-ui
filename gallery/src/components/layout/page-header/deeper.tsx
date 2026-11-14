import { ButtonLink, isPlainClick, LinkProvider, PageHeader, PageTrailProvider, SegmentedControl, TopBarTrail, useNavigateTo } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { Building2, Download, Receipt } from 'lucide-react'
import { useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: ['Billing'],
  entries: [
    { id: 'invoices', path: '/invoices', label: 'Invoices', section: 'Billing', icon: <Receipt /> },
    { id: 'customers', path: '/customers', label: 'Customers', section: 'Billing', icon: <Building2 /> },
  ],
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

type Shown = 'record' | 'tab'

export default function PageHeaderDeeper() {
  const [shown, setShown] = useState<Shown>('record')
  const [followed, setFollowed] = useState<string | null>(null)
  return (
    <LinkProvider component={ExampleLink} navigate={(to) => setFollowed(String(to))}>
      <div className="flex flex-col gap-4">
        <SegmentedControl<Shown>
          className="self-start"
          label="The page shown"
          size="sm"
          value={shown}
          onChange={setShown}
          options={[
            { value: 'record', label: 'An invoice' },
            { value: 'tab', label: 'A customer’s tab' },
          ]}
        />
        {/* The shell's in an application: what the trail of its top bar is made from. */}
        <PageTrailProvider menu={MENU} pathname={shown === 'record' ? '/invoices/2026-0042' : '/customers/1024/exceptions'}>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex h-14 items-center border-b border-border px-4 glass-bar">
              <TopBarTrail />
            </div>
            <div className="p-4 sm:p-6">
              {shown === 'record' ? (
                <PageHeader
                  title="Invoice 2026-0042"
                  description="Sent to Acme on 12 October."
                  parents={[{ label: 'October', href: '/invoices?month=10' }]}
                  actions={
                    <ButtonLink to="/invoices/2026-0042.pdf" variant="outline" size="sm" leftIcon={<Download />}>
                      Download
                    </ButtonLink>
                  }
                />
              ) : (
                // Customers › Acme (1024) › Exceptions: the heading stays the customer's.
                <PageHeader
                  title="Acme (1024)"
                  name="Exceptions"
                  description="A customer since 2019, and the tab shown: its exceptions."
                  parents={[{ label: 'Acme (1024)', href: '/customers/1024' }]}
                />
              )}
            </div>
          </div>
        </PageTrailProvider>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Followed: <span className="font-mono text-foreground">{followed ?? 'nothing yet'}</span>
        </p>
      </div>
    </LinkProvider>
  )
}
