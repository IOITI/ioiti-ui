import { createContext, useContext } from 'react'
import type { ElementType } from 'react'

/** Follows an address from code: a path, or a step in the history (-1: back). */
export type NavigateTo = (to: string | number) => void

export interface LinkSettings {
  /** What draws a link, given `href` and the props of an `<a>`. */
  component: ElementType
  navigate: NavigateTo
}

function navigateWithTheWindow(to: string | number): void {
  if (typeof to === 'number') window.history.go(to)
  else window.location.assign(to)
}

// Outside a provider (no router, or a component rendered alone in a test): plain links, and the window's history.
export const LinkContext = createContext<LinkSettings>({ component: 'a', navigate: navigateWithTheWindow })

/** The link a component draws: the one it was given, else the application's (LinkProvider), else `<a>`. */
export function useLinkComponent(given?: ElementType): ElementType {
  const { component } = useContext(LinkContext)
  return given ?? component
}

/** Follows an address from code, through the application's router when it gave one (LinkProvider). */
export function useNavigateTo(): NavigateTo {
  return useContext(LinkContext).navigate
}
