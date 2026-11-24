import { IoitiProvider } from 'ioiti-ui'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { GalleryLanguageContext, LANGUAGE_KEY, LANGUAGES, readLanguage } from './language-context'
import type { GalleryLanguage } from './language-context'

/** The gallery's IoitiProvider, in the language chosen (kept in this browser). */
export function GalleryProviders({ children }: { children: ReactNode }) {
  const [language, setChosen] = useState<GalleryLanguage>(readLanguage)
  const state = useMemo(
    () => ({
      language,
      setLanguage: (next: GalleryLanguage) => {
        setChosen(next)
        try {
          window.localStorage.setItem(LANGUAGE_KEY, next)
        } catch {
          // A browser that keeps nothing: the language holds until the page is left.
        }
      },
    }),
    [language],
  )
  const { locale, messages } = LANGUAGES[language]
  return (
    <GalleryLanguageContext.Provider value={state}>
      <IoitiProvider appName="ioiti-ui" locale={locale} messages={messages}>
        {children}
      </IoitiProvider>
    </GalleryLanguageContext.Provider>
  )
}
