import { Button, SpotlightSearch, themeStorageKey } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { History } from 'lucide-react'
import { useState } from 'react'

const PAGE = '/components/top-bar/spotlight-search'

// Each leads to an example of this page: chosen, it is kept in this browser, and offered first the next time.
const ITEMS: SpotlightSearchItem[] = [
  { id: 'go-to', title: 'A palette that goes somewhere', category: 'Examples', href: `${PAGE}#go-to` },
  { id: 'actions', title: 'Actions too', category: 'Examples', href: `${PAGE}#actions` },
  { id: 'pick-several', title: 'Choosing several', category: 'Examples', href: `${PAGE}#pick-several` },
  { id: 'fetched', title: 'Found as it is typed', category: 'Examples', href: `${PAGE}#fetched` },
  { id: 'remembered', title: 'What was chosen, first', category: 'Examples', href: `${PAGE}#remembered` },
]

export default function SpotlightSearchRemembered() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" leftIcon={<History />} onClick={() => setOpen(true)}>
        Go to an example…
      </Button>
      {/* What an application does as someone signs out: what was kept for them goes. */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          try {
            window.localStorage.removeItem(`${themeStorageKey()}.spotlight.examples`)
          } catch {
            // Nothing could be kept.
          }
        }}
      >
        Forget them
      </Button>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to an example"
        placeholder="An example of this page…"
        remember="examples"
        items={ITEMS}
      />
    </div>
  )
}
