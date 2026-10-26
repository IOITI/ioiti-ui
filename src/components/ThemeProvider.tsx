import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

import {
  applyTheme,
  readPreference,
  resolveTheme,
  systemIsDark,
  themeStorageKey,
  watchSystem,
  writePreference,
} from '../lib/theme.js'
import type { ThemePreference } from '../lib/theme.js'

import { ThemeContext } from './theme-context.js'

interface ThemeProviderProps {
  /**
   * Where the choice is kept in this browser: one key per application. By default the key the
   * pre-paint script was given (its tag's `data-storage-key`), else `ioiti.theme`.
   */
  storageKey?: string
  children: ReactNode
}

/**
 * Holds the theme for the whole interface, a sign-in page included. While the
 * preference is to follow the system, a change of the system setting (a phone
 * going dark in the evening) is followed at once.
 */
export function ThemeProvider({ storageKey, children }: ThemeProviderProps) {
  const key = useMemo(() => themeStorageKey(storageKey), [storageKey])
  const [preference, setStored] = useState<ThemePreference>(() => readPreference(key))
  const systemDark = useSyncExternalStore(watchSystem, systemIsDark)
  const theme = resolveTheme(preference, systemDark)

  // Before the browser paints: no frame in the theme being left.
  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      writePreference(next, key)
      setStored(next)
    },
    [key],
  )

  const value = useMemo(() => ({ preference, theme, setPreference }), [preference, theme, setPreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
