import { useLayoutEffect, useRef } from 'react'

/**
 * Whether this render shows another page than the one on screen: its address changed. A change of
 * the query alone is none, nor is the page's own (a filter, a refresh, a tab), even in a transition.
 * The shell moves the page only then (AppShell, src/styles/motion.css).
 */
export function usePageChanged(pathname: string): boolean {
  // The address on screen: written once a render is committed, so that a render React drops
  // changes nothing.
  const shown = useRef(pathname)
  useLayoutEffect(() => {
    shown.current = pathname
  }, [pathname])
  // Read in render on purpose, only a commit writing it: a render drawn twice, or dropped, gives the
  // same answer. State would draw the whole shell again after each change of page.
  // oxlint-disable-next-line react/refs
  return shown.current !== pathname
}
