import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'

import { changeLook } from '../lib/motion.js'
import {
  applyAccent,
  applyMaterial,
  applyTheme,
  readAccent,
  readMaterial,
  readPreference,
  resolveAccent,
  resolveMaterial,
  resolveTheme,
  shownAccent,
  shownMaterial,
  systemIsDark,
  themeStorageKey,
  watchSystem,
  writeAccent,
  writeMaterial,
  writePreference,
} from '../lib/theme.js'
import type { Accent, Material, ThemePreference } from '../lib/theme.js'

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
 * going dark in the evening) is followed at once. Holds the accent and the
 * material too: the ones chosen in this browser, else the application's, which
 * the pre-paint script wrote on <html>.
 */
export function ThemeProvider({ storageKey, children }: ThemeProviderProps) {
  const key = useMemo(() => themeStorageKey(storageKey), [storageKey])
  const [preference, setStored] = useState<ThemePreference>(() => readPreference(key))
  const systemDark = useSyncExternalStore(watchSystem, systemIsDark)
  const theme = resolveTheme(preference, systemDark)
  const [accent, setAccentShown] = useState<Accent>(() => resolveAccent(readAccent(key), shownAccent()))
  const [material, setMaterialShown] = useState<Material>(() => resolveMaterial(readMaterial(key), shownMaterial()))

  // Before the browser paints: no frame in the theme being left. A choice is drawn inside the change of
  // look (changeLook: the whole page in one cross-fade), the system's at once.
  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])
  useLayoutEffect(() => {
    applyAccent(accent)
  }, [accent])
  useLayoutEffect(() => {
    applyMaterial(material)
  }, [material])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      writePreference(next, key)
      changeLook(() => flushSync(() => setStored(next)))
    },
    [key],
  )
  const setAccent = useCallback(
    (next: Accent) => {
      writeAccent(next, key)
      changeLook(() => flushSync(() => setAccentShown(next)))
    },
    [key],
  )
  const setMaterial = useCallback(
    (next: Material) => {
      writeMaterial(next, key)
      changeLook(() => flushSync(() => setMaterialShown(next)))
    },
    [key],
  )

  const value = useMemo(
    () => ({ preference, theme, setPreference, accent, material, setAccent, setMaterial }),
    [preference, theme, setPreference, accent, material, setAccent, setMaterial],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
