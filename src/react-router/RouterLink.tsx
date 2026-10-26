import type { ComponentProps } from 'react'
import { Link } from 'react-router'

/**
 * React Router's link for the components that hand their link an `href`, as an `<a>` takes it:
 * `Link` reads `to`, and without it every link would lead to the page already shown.
 */
export function RouterLink({ href = '', ...props }: ComponentProps<'a'>) {
  return <Link to={href} {...props} />
}
