import { Button, NotFoundState, PageTrailProvider } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { useState } from 'react'

// The application's menu: AppShell gives every page its trail from it.
const MENU: Menu = {
  sections: ['Work'],
  entries: [{ id: 'invoices', path: '/invoices', label: 'Invoices', section: 'Work' }],
}

export default function NotFoundStateRecord() {
  // A page that is none takes the focus as it opens (its heading, read out at once): shown at a press, here.
  const [shown, setShown] = useState(false)
  return shown ? (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* In an application, the shell's trail; here one of this box's own, so that the page around it keeps its name. */}
      <PageTrailProvider menu={MENU} pathname="/invoices/2026-9999">
        <NotFoundState
          title="This invoice does not exist."
          description="Invoice 2026-9999 was never made, or it was removed."
          name="Invoice not found"
          suggestions={[
            { label: 'Tables and lists', href: '/components/tables', description: 'Every invoice, newest first' },
            { label: 'A dashboard', href: '/patterns/dashboard', description: 'The figures of the day' },
          ]}
          home={{ href: '/', label: 'Back to the gallery' }}
        />
      </PageTrailProvider>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setShown(true)}>
      Show the page of a missing invoice
    </Button>
  )
}
