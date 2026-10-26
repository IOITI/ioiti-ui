import { ChevronLeft, ChevronRight, House } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { useLinkComponent } from '../components/link-context.js'
import { Breadcrumb } from '../components/ui/breadcrumb.js'
import type { BreadcrumbItem } from '../components/ui/breadcrumb.js'
import { cn } from '../lib/utils.js'
import { DEFAULT_HOME } from './navigation.js'
import type { Menu } from './navigation.js'
import { NamedContext, PublisherContext, TrailContext, usePageTrail } from './page-trail-context.js'
import type { Named } from './page-trail-context.js'

/**
 * Keeps the name the page shown gives itself (usePageName), for the trail of
 * the top bar. A name is kept with its address and only read for it: the page
 * left behind takes its name away after the next page is drawn, never before.
 */
export function PageTrailProvider({ menu, pathname, children }: { menu: Menu; pathname: string; children: ReactNode }) {
  const [named, publish] = useState<Named | null>(null)
  const publisher = useMemo(() => ({ pathname, publish }), [pathname])
  const trail = useMemo(() => ({ menu, pathname }), [menu, pathname])
  return (
    <TrailContext.Provider value={trail}>
      <PublisherContext.Provider value={publisher}>
        <NamedContext.Provider value={named?.pathname === pathname ? named : null}>{children}</NamedContext.Provider>
      </PublisherContext.Provider>
    </TrailContext.Provider>
  )
}

/**
 * The trail in the top bar: whole on a wide screen. Narrower, beside the
 * sidebar, its last two steps. On a phone, where the top bar has room for a
 * word or two, the step before the page alone (a link back when it is one):
 * the page's own name is its heading, just under.
 */
export function TopBarTrail({ home = DEFAULT_HOME }: { home?: { label: string; href: string } }) {
  const Link = useLinkComponent()
  const items: BreadcrumbItem[] = [{ label: home.label, href: home.href, icon: <House aria-hidden /> }, ...usePageTrail()]
  const tail = items.slice(-2)
  return (
    <>
      <Breadcrumb items={items} wrap={false} maxItems={items.length} className="hidden min-w-0 lg:block" />
      <nav aria-label="Breadcrumb" className="min-w-0 lg:hidden">
        <ol className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
          {tail.map((item, index) => {
            const last = index === tail.length - 1
            return (
              <li
                key={`${index}-${item.label}`}
                className={cn(
                  'flex min-w-0 items-center gap-1',
                  !last && 'md:max-w-[45%] md:shrink-0',
                  last && tail.length > 1 && 'hidden md:flex',
                )}
              >
                {index > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-neutral-300 dark:text-neutral-700" />}
                {last || !item.href ? (
                  <span aria-current={last ? 'page' : undefined} className={cn('truncate', last && 'font-medium text-foreground')}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="flex min-w-0 items-center gap-0.5 hover:text-foreground">
                    <ChevronLeft aria-hidden className="size-4 shrink-0 md:hidden" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
