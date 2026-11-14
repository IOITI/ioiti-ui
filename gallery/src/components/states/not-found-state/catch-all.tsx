import { Button, NotFoundPage, PageTrailProvider } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { useState } from 'react'

const MENU: Menu = {
  sections: ['Components'],
  entries: [{ id: 'tables', path: '/components/tables', label: 'Tables and lists', section: 'Components' }],
}

export default function NotFoundStateCatchAll() {
  // A page that is none takes the focus as it opens (its heading, read out at once): shown at a press, here.
  const [shown, setShown] = useState(false)
  return shown ? (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/*
        The router's catch-all ({ path: '*', element: <NotFoundPage /> }), at an address under an entry of the menu:
        an old link, a typo. It suggests that entry. The trail is this box's own here, as in the example above.
      */}
      <PageTrailProvider menu={MENU} pathname="/components/tables/invoce-list">
        <NotFoundPage back={null} />
      </PageTrailProvider>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setShown(true)}>
      Show the page of an unknown address
    </Button>
  )
}
