import { NotFoundPage, PageTrailProvider } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'

const MENU: Menu = {
  sections: ['Components'],
  entries: [{ id: 'tables', path: '/components/tables', label: 'Tables and lists', section: 'Components' }],
}

export default function NotFoundStateCatchAll() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/*
        The router's catch-all ({ path: '*', element: <NotFoundPage /> }), at an address under an entry of the menu:
        an old link, a typo. It suggests that entry. The trail is this box's own here, as in the example above.
      */}
      <PageTrailProvider menu={MENU} pathname="/components/tables/invoce-list">
        {/* Drawn in a part of this page: the focus stays where it is (on a page of its own, its heading takes it). */}
        <NotFoundPage back={null} focusOnMount={false} />
      </PageTrailProvider>
    </div>
  )
}
