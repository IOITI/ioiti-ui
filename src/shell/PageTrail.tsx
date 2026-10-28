import { ChevronLeft, ChevronRight, House } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

import { useLinkComponent } from '../components/link-context.js'
import { Breadcrumb } from '../components/ui/breadcrumb.js'
import type { BreadcrumbItem } from '../components/ui/breadcrumb.js'
import { cn } from '../lib/utils.js'
import { DEFAULT_HOME } from './navigation.js'
import type { Menu } from './navigation.js'
import { NamedContext, PublisherContext, TrailContext, usePageTrail } from './page-trail-context.js'
import type { Named } from './page-trail-context.js'
import { wholeTrailFits } from './trail-fit.js'

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

/** The widths of the whole trail as drawn: each step, the gap between two, and the page's own step at its whole name. */
function measured(trail: HTMLElement, room: HTMLElement) {
  const steps = [...trail.querySelectorAll<HTMLElement>('ol > li')]
  const page = steps.at(-1)
  const name = page?.querySelector<HTMLElement>('[data-crumb-name]')
  const list = trail.querySelector('ol')
  return {
    room: room.clientWidth,
    before: steps.slice(0, -1).map((step) => step.getBoundingClientRect().width),
    gap: list ? Number.parseFloat(getComputedStyle(list).columnGap) || 0 : 0,
    // A name cut short is as wide as the step shows it, and what is cut off.
    page: page ? page.getBoundingClientRect().width + (name ? name.scrollWidth - name.clientWidth : 0) : 0,
  }
}

/**
 * Whether the whole trail fits the room the top bar leaves it (the chips and the controls beside it take theirs
 * first), measured again as that room changes, and as the steps do (a page's name, the fonts). Where nothing can
 * be measured (no ResizeObserver), it fits.
 */
function useWholeTrailFits(room: RefObject<HTMLElement | null>, trail: RefObject<HTMLElement | null>, steps: string): boolean {
  const [fits, setFits] = useState(true)
  useLayoutEffect(() => {
    const box = room.current
    const whole = trail.current
    if (!box || !whole || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      // Not drawn on this screen (below lg): the shorter trail is shown anyway.
      if (getComputedStyle(whole).display === 'none') setFits(true)
      else setFits(wholeTrailFits(measured(whole, box)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    for (const step of whole.querySelectorAll('li')) observer.observe(step)
    document.fonts?.addEventListener('loadingdone', measure)
    return () => {
      observer.disconnect()
      document.fonts?.removeEventListener('loadingdone', measure)
    }
  }, [room, trail, steps])
  return fits
}

/**
 * The trail in the top bar: whole on a wide screen, as long as it fits the room the top bar leaves it (the page's
 * own name may be cut short, not the steps before it). Narrower, or where the whole trail does not fit, its last
 * two steps. On a phone, where the top bar has room for a word or two, the step before the page alone (a link back
 * when it is one): the page's own name is its heading, just under. The whole trail that does not fit is still laid
 * out, out of sight and of reach, to be measured again.
 */
export function TopBarTrail({ home = DEFAULT_HOME }: { home?: { label: string; href: string } }) {
  const Link = useLinkComponent()
  const items: BreadcrumbItem[] = [{ label: home.label, href: home.href, icon: <House aria-hidden /> }, ...usePageTrail()]
  const tail = items.slice(-2)
  const room = useRef<HTMLDivElement>(null)
  const whole = useRef<HTMLDivElement>(null)
  const fits = useWholeTrailFits(room, whole, JSON.stringify(items.map((item) => item.label)))
  return (
    <div ref={room} className="relative flex w-full min-w-0 items-center">
      <div
        ref={whole}
        aria-hidden={fits ? undefined : true}
        inert={!fits}
        className={cn('hidden min-w-0 lg:block', !fits && 'lg:invisible lg:absolute lg:left-0 lg:w-max')}
      >
        <Breadcrumb items={items} wrap={false} maxItems={items.length} />
      </div>
      <nav aria-label="Breadcrumb" className={cn('min-w-0', fits && 'lg:hidden')}>
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
    </div>
  )
}
