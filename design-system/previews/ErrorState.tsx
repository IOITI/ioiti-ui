import { Button, ErrorState, PageHeader, PageTrailProvider } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

// The application's menu: AppShell gives every page its trail from it.
const MENU: Menu = {
  sections: ['Work'],
  entries: [{ id: 'orders', path: '/orders', label: 'Orders', section: 'Work' }],
}

// What the page threw as it drew: data it did not expect.
const ERROR = new TypeError("Cannot read properties of undefined (reading 'lines')")

function Preview() {
  // Here Try again works: the page is drawn again, and draws.
  const [failed, setFailed] = useState(true)
  return (
    <div className="flex flex-col items-start gap-3 p-5">
      <div className="w-full overflow-hidden rounded-2xl border border-border">
        {/* In an application, the shell's trail; here one of the card's own, which leaves the frame's title alone. */}
        <PageTrailProvider menu={MENU} pathname="/orders/2026-0042" tabTitle={false}>
          {failed ? (
            // What AppShell shows in place of a page that throws. Drawn in a part of a page, the focus stays where it
            // is (on a page of its own, its heading takes it). The frame has no router: its way home goes to #home.
            <ErrorState focusOnMount={false} error={ERROR} onRetry={() => setFailed(false)} home={{ href: '#home', label: 'Back to home' }} />
          ) : (
            <div className="p-6">
              <PageHeader title="Order 2026-0042" description="Acme · 1,840.00 € · sent on 12 November." />
            </div>
          )}
        </PageTrailProvider>
      </div>
      {!failed && (
        <Button size="sm" variant="outline" onClick={() => setFailed(true)}>
          Start again
        </Button>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
