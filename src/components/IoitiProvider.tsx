import { MotionConfig } from 'framer-motion'
import { useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { applyReducedMotion } from '../lib/motion.js'
import type { ReducedMotion } from '../lib/motion.js'

import { AppNameContext } from './app-context.js'
import { createShortcutRegistry, ShortcutsContext } from './shortcuts-context.js'
import { ThemeProvider } from './ThemeProvider.js'

interface IoitiProviderProps {
  /** The application's name, which ends the title of every tab ("Orders · My App"). */
  appName?: string
  /**
   * Where the theme chosen is kept in the browser: one key per application. By default the key
   * the pre-paint script was given (`ioiti({ themeStorageKey })` in vite.config), else `ioiti.theme`.
   */
  themeStorageKey?: string
  /**
   * Animations reduced as the system asks (`user`, the default), always, or never: framer-motion's,
   * and the stylesheets' too (a change of page, the loops of spinners, `motion-safe:` and `motion-reduce:`).
   * Reduced, movement goes and fades stay.
   */
  reducedMotion?: ReducedMotion
  children: ReactNode
}

/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, and the registry of
 * its keyboard shortcuts (useShortcut).
 */
export function IoitiProvider({ appName, themeStorageKey, reducedMotion = 'user', children }: IoitiProviderProps) {
  // For the stylesheets (motion.css), before the browser paints.
  useLayoutEffect(() => {
    applyReducedMotion(reducedMotion)
    return () => applyReducedMotion('user')
  }, [reducedMotion])

  // The application's keyboard shortcuts, its own.
  const [shortcuts] = useState(createShortcutRegistry)

  return (
    <AppNameContext.Provider value={appName ?? null}>
      <ShortcutsContext.Provider value={shortcuts}>
        <ThemeProvider storageKey={themeStorageKey}>
          <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
        </ThemeProvider>
      </ShortcutsContext.Provider>
    </AppNameContext.Provider>
  )
}
