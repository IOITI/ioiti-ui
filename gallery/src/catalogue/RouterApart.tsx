import type { ReactNode } from 'react'
import { UNSAFE_LocationContext, UNSAFE_RouteContext } from 'react-router'

/** Where no route is: what a router finds at the top of a page. */
const NO_ROUTE = { outlet: null, matches: [], isDataRoute: false }

/**
 * An example that makes a router of its own, drawn apart from the gallery's: React Router lets no router stand
 * inside another (an application has one), and the routes of the gallery's page would be taken for its parents.
 * Under it, nothing of the gallery's router is known: its address, links and errors are the example's router's.
 */
export function RouterApart({ children }: { children: ReactNode }) {
  return (
    // No location: to React Router, the example's router stands inside none (its default too, which its type does not say).
    <UNSAFE_LocationContext.Provider value={null as never}>
      <UNSAFE_RouteContext.Provider value={NO_ROUTE}>{children}</UNSAFE_RouteContext.Provider>
    </UNSAFE_LocationContext.Provider>
  )
}
