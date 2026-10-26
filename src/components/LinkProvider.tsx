import { useContext, useMemo } from 'react'
import type { ElementType, ReactNode } from 'react'

import { LinkContext } from './link-context.js'
import type { NavigateTo } from './link-context.js'

interface LinkProviderProps {
  /**
   * What draws a link, given `href` and the props of an `<a>`: the router's (`RouterLink` of
   * `ioiti-ui/react-router`). A plain `<a>` without one.
   */
  component?: ElementType
  /** Follows an address from code (a palette's Enter, a 404's "Previous page"). The window's without one. */
  navigate?: NavigateTo
  children: ReactNode
}

/**
 * The application's links, for every component that draws one. What leads to another page is a
 * link, which can be opened in another tab as well as followed; given the router's, it is followed
 * without loading the page again. A component given a link of its own (`linkComponent`) keeps it.
 */
export function LinkProvider({ component, navigate, children }: LinkProviderProps) {
  const outer = useContext(LinkContext)
  const value = useMemo(
    () => ({ component: component ?? outer.component, navigate: navigate ?? outer.navigate }),
    [component, navigate, outer],
  )
  return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>
}
