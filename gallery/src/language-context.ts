// The language the gallery's components speak and write in: English, as the package does by default, or French. The
// gallery's own words (its pages, its guidelines) stay English: what changes is what an application would get.
import type { MessagesOverride } from 'ioiti-ui'
import { fr } from 'ioiti-ui/locales/fr'
import { createContext, useContext } from 'react'

export type GalleryLanguage = 'en' | 'fr'

export const LANGUAGES: Record<GalleryLanguage, { label: string; locale: string; lang: string; messages?: MessagesOverride }> = {
  en: { label: 'English', locale: 'en-GB', lang: 'en' },
  fr: { label: 'Français', locale: 'fr-FR', lang: 'fr', messages: fr },
}

/** Where the language chosen is kept, beside the look's choice (`ioiti-gallery.theme…`). */
export const LANGUAGE_KEY = 'ioiti-gallery.language'

/** The language chosen in this browser; English otherwise. */
export function readLanguage(): GalleryLanguage {
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === 'fr' ? 'fr' : 'en'
  } catch {
    return 'en'
  }
}

export interface GalleryLanguageState {
  language: GalleryLanguage
  setLanguage: (language: GalleryLanguage) => void
}

// Outside the gallery's providers (its tests render pages with IoitiProvider alone): English, and nothing to change.
export const GalleryLanguageContext = createContext<GalleryLanguageState>({ language: 'en', setLanguage: () => {} })

export function useGalleryLanguage(): GalleryLanguageState {
  return useContext(GalleryLanguageContext)
}
