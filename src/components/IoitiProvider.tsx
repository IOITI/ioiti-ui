import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

import { AppNameContext } from './app-context.js'
import { ThemeProvider } from './ThemeProvider.js'

interface IoitiProviderProps {
  /** The application's name, which ends the title of every tab ("Orders · My App"). */
  appName?: string
  /**
   * Where the theme chosen is kept in the browser: one key per application. By default the key
   * the pre-paint script was given (`ioiti({ themeStorageKey })` in vite.config), else `ioiti.theme`.
   */
  themeStorageKey?: string
  /** Animations reduced as the system asks (`user`, the default), always, or never. */
  reducedMotion?: 'user' | 'always' | 'never'
  children: ReactNode
}

/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, and the application's name.
 */
export function IoitiProvider({ appName, themeStorageKey, reducedMotion = 'user', children }: IoitiProviderProps) {
  return (
    <AppNameContext.Provider value={appName ?? null}>
      <ThemeProvider storageKey={themeStorageKey}>
        <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
      </ThemeProvider>
    </AppNameContext.Provider>
  )
}
