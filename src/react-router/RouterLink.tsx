import type { ComponentProps } from 'react'
import { Link } from 'react-router'

/**
 * React Router's link for the components that hand their link an `href`, as an `<a>` takes it:
 * `Link` reads `to`, and without it every link would lead to the page already shown.
 *
 * A part of the page shown (`#trust`: a check leading to what says more of it) is no route: a plain
 * `<a>`, which the browser follows itself. It scrolls the part into view in whatever scrolls it (the
 * shell's page, not the window) and keeps the address's query; the router's link would write
 * `/page#trust`, drop the query and scroll nothing.
 */
export function RouterLink({ href = '', ...props }: ComponentProps<'a'>) {
  if (href.startsWith('#')) return <a href={href} {...props} />
  return <Link to={href} {...props} />
}
