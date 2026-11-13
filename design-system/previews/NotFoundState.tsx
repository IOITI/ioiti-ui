import { LinkProvider, NotFoundState } from 'ioiti-ui'
import { forwardRef, useEffect, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { createRoot } from 'react-dom/client'

// The frame has no router and no history of its own: its links and "Previous page" stay here.
const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function Link({ onClick, ...props }, ref) {
  return (
    <a
      ref={ref}
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
      }}
      {...props}
    />
  )
})

function Preview() {
  // The page's heading takes the focus as it comes (for a screen reader): not on the card's load, which would
  // scroll the page that holds it. Inert until then, so that the focus goes nowhere.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return (
    <LinkProvider component={Link} navigate={() => {}}>
      <div inert={!ready} className="p-5">
        <NotFoundState
          title="This invoice does not exist."
          description="Invoice 2026-9999 was never made, or it was removed."
          name="Invoice not found"
          pathname="/invoices/2026-9999"
          suggestions={[
            { label: 'Data display', href: '#data', description: 'Tables and figures' },
            { label: 'Shell', href: '#shell', description: 'The frame of the pages' },
          ]}
          home={{ href: '#home', label: 'Back to home' }}
        />
      </div>
    </LinkProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
