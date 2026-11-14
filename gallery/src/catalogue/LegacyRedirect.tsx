import { Navigate, useLocation } from 'react-router'

import { movedTo } from './legacy'

/** A former page's address: to the component a link to one of its parts was for, else to the category it became. */
export function LegacyRedirect() {
  const { pathname, hash } = useLocation()
  return <Navigate replace to={movedTo(pathname, hash) ?? '/components'} />
}
