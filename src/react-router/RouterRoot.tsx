import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { LinkProvider } from '../components/LinkProvider.js'
import { ToastProvider } from '../components/ToastProvider.js'
import { RouterLink } from './RouterLink.js'

interface RouterRootProps {
  /** The pages; the router's child routes (`<Outlet />`) by default. */
  children?: ReactNode
  /** Classes of the toasts' frame, to move them (above a bar fixed at the bottom of a page: `bottom-20`). */
  toastWrapperClassName?: string
}

/**
 * The root route of an application on React Router: every link of ioiti-ui goes through the
 * router (opened in another tab with a modifier, as any link), and the toasts are shown.
 */
export function RouterRoot({ children, toastWrapperClassName }: RouterRootProps) {
  const navigate = useNavigate()
  const navigateTo = useCallback((to: string | number) => {
    if (typeof to === 'number') void navigate(to)
    else void navigate(to)
  }, [navigate])
  return (
    <LinkProvider component={RouterLink} navigate={navigateTo}>
      <ToastProvider wrapperClassName={toastWrapperClassName}>{children ?? <Outlet />}</ToastProvider>
    </LinkProvider>
  )
}
