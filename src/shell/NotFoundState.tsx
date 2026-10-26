import { ArrowLeft, Home } from 'lucide-react'
import type { ReactNode } from 'react'

import { ButtonLink } from '../components/ButtonLink.js'
import { useNavigateTo } from '../components/link-context.js'
import { Button } from '../components/ui/button.js'
import { NotFound } from '../components/ui/not-found.js'
import type { NotFoundSuggestion } from '../components/ui/not-found.js'
import { menuEntry, PAGE_NOT_FOUND } from './navigation.js'
import type { Crumb } from './navigation.js'
import { usePageName, useTabTitle, useTrail } from './page-trail-context.js'

export interface NotFoundStateProps {
  /** The heading. */
  title: string
  description: ReactNode
  /** What the trail of the top bar and the tab call the page: the heading, unless said otherwise. */
  name?: string
  /** The pages between its entry of the menu and itself, as PageHeader takes them. */
  parents?: Crumb[]
  /** Up to three pages that may be what was looked for. */
  suggestions?: NotFoundSuggestion[]
  /** The address shown: the shell's by default, else the window's. */
  pathname?: string
  /** The way home, a link; `null` for none. */
  home?: { href: string; label: string } | null
  /** The way back, a step back in this tab's history; `null` for none. */
  back?: { label: string } | null
}

const HOME = { href: '/', label: 'Back to home' }
const BACK = { label: 'Previous page' }

/**
 * What a page shows when its address names nothing: the router's catch-all, or
 * a page whose record the server does not have (its 404). EasyUI's 404, named
 * in the trail and the tab as any page is, with the way home and back.
 */
export function NotFoundState({ title, description, name = title, parents, suggestions, pathname, home = HOME, back = BACK }: NotFoundStateProps) {
  const navigate = useNavigateTo()
  const trail = useTrail()
  usePageName(name, parents)
  useTabTitle(name)
  const path = pathname ?? trail?.pathname ?? window.location.pathname
  return (
    <NotFound title={title} description={description} path={path} suggestions={suggestions}>
      {/* Home is a place, a link; the page before is a step back in this tab's history. */}
      {home && (
        <ButtonLink to={home.href} leftIcon={<Home className="size-4" />}>
          {home.label}
        </ButtonLink>
      )}
      {back && (
        <Button variant="outline" leftIcon={<ArrowLeft className="size-4" />} onClick={() => navigate(-1)}>
          {back.label}
        </Button>
      )}
    </NotFound>
  )
}

/**
 * The page of an address that is no page (the router's catch-all, `path: '*'`). An address under
 * an entry of the menu that leads nowhere (an old link, a typo) suggests that entry.
 */
export function NotFoundPage({
  title = 'There is no page here.',
  description = 'The address does not match any page of this application.',
  ...props
}: Partial<NotFoundStateProps>) {
  const trail = useTrail()
  const path = props.pathname ?? trail?.pathname ?? window.location.pathname
  const entry = trail ? menuEntry(trail.menu, path) : undefined
  return (
    <NotFoundState
      title={title}
      description={description}
      name={PAGE_NOT_FOUND}
      suggestions={entry && entry.path !== '/' ? [{ label: entry.label, href: entry.path, description: entry.section }] : undefined}
      {...props}
    />
  )
}
