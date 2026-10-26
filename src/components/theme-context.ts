import { createContext, useContext } from 'react'

import type { Accent, Material, Theme, ThemePreference } from '../lib/theme.js'

export interface ThemeState {
  /** What was chosen: a theme, or to follow the system. */
  preference: ThemePreference
  /** What is shown. */
  theme: Theme
  setPreference: (preference: ThemePreference) => void
  /** The accent shown: the one chosen in this browser, else the application's, else neutral. */
  accent: Accent
  /** The material shown: the one chosen in this browser, else the application's, else flat. */
  material: Material
  setAccent: (accent: Accent) => void
  setMaterial: (material: Material) => void
}

// Outside a provider (a component rendered alone in a test), the interface is as it always was: dark, neutral, flat.
export const ThemeContext = createContext<ThemeState>({
  preference: 'dark',
  theme: 'dark',
  setPreference: () => {},
  accent: 'neutral',
  material: 'flat',
  setAccent: () => {},
  setMaterial: () => {},
})

export function useTheme(): ThemeState {
  return useContext(ThemeContext)
}
