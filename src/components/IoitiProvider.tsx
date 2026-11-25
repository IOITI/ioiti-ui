import { MotionConfig } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { devWarn } from '../lib/dev.js'
import { DEFAULT_LOCALE, firstDayOf, hourCycleOf } from '../lib/locale.js'
import type { HourCycle, WeekDay } from '../lib/locale.js'
import { mergeMessages } from '../lib/messages.js'
import { applyReducedMotion } from '../lib/motion.js'
import type { ReducedMotion } from '../lib/motion.js'
import { en } from '../locales/en.js'

import { AppNameContext } from './app-context.js'
import { ErrorReporterContext } from './error-context.js'
import type { ErrorReporter } from './error-context.js'
import { LocaleContext } from './locale-context.js'
import type { LocaleValue, MessagesOverride } from './locale-context.js'
import { createShortcutRegistry, ShortcutsContext } from './shortcuts-context.js'
import { ThemeProvider } from './ThemeProvider.js'

/** The props of `IoitiProvider`. */
export interface IoitiProviderProps {
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
  /**
   * Told of every error a page shows instead of itself: one AppShell's boundary caught, or an ErrorBoundary, or the
   * router's error page (RouterErrorPage). Its place to report it: the application's error tracker, its server's log.
   * Once per error, with where it was caught (`source`) and, from a boundary, the components it was thrown in.
   */
  onError?: ErrorReporter
  /**
   * The locale the interface speaks and writes in (BCP 47: "en-GB", "fr-FR", "en-US"): how its numbers, amounts and
   * dates are written, the day its calendars' weeks start on, its clock. `en-GB` by default. The words are the
   * catalogue's (`messages`): give both.
   */
  locale?: string
  /**
   * The package's words: a language's catalogue (`fr` from `ioiti-ui/locales/fr`), or some words of an application's
   * own (`{ date: { today: 'Now' } }`), given over English's. A constant, not an object written in the render.
   */
  messages?: MessagesOverride
  /** The day the calendars' weeks start on (0 Sunday, 1 Monday): the locale's by default. */
  weekStartsOn?: WeekDay
  /** A clock of 24 hours ("h23") or 12 ("h12"): the locale's by default. */
  hourCycle?: HourCycle
  children: ReactNode
}

/** A tag Intl takes, in its canonical form ("fr-fr" is "fr-FR"); the default one, said in development, for another. */
function canonical(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? DEFAULT_LOCALE
  } catch {
    devWarn('locale-unknown', locale)
    return DEFAULT_LOCALE
  }
}

/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, its language and
 * formats, and the registry of its keyboard shortcuts (useShortcut).
 */
export function IoitiProvider({
  appName,
  themeStorageKey,
  reducedMotion = 'user',
  onError,
  locale = DEFAULT_LOCALE,
  messages,
  weekStartsOn,
  hourCycle,
  children,
}: IoitiProviderProps) {
  // For the stylesheets (motion.css), before the browser paints.
  useLayoutEffect(() => {
    applyReducedMotion(reducedMotion)
    return () => applyReducedMotion('user')
  }, [reducedMotion])

  // The application's keyboard shortcuts, its own.
  const [shortcuts] = useState(createShortcutRegistry)

  // The application's reporter, read when an error comes: one function for the pages, whatever is given at each render.
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onErrorRef.current = onError
  })
  const report = useCallback<ErrorReporter>((error, details) => onErrorRef.current?.(error, details), [])

  // The interface's locale, and its words: English's, with the language's or the application's given over them.
  const tag = canonical(locale)
  const language = useMemo<LocaleValue>(
    () => ({
      locale: tag,
      weekStartsOn: weekStartsOn ?? firstDayOf(tag),
      hourCycle: hourCycle ?? hourCycleOf(tag),
      catalogue: messages ? mergeMessages(en, messages) : en,
    }),
    [tag, messages, weekStartsOn, hourCycle],
  )

  // A screen reader reads the words with the rules of the page's language: the locale's, said where it names another
  // (a page without one is axe's to say).
  useEffect(() => {
    const page = document.documentElement.lang
    const spoken = (tag: string) => {
      try {
        return new Intl.Locale(tag).language
      } catch {
        return tag
      }
    }
    if (page && spoken(page) !== spoken(language.locale)) devWarn('locale-not-the-page', `${language.locale}, lang="${page}"`)
  }, [language.locale])

  return (
    <AppNameContext.Provider value={appName ?? null}>
      <ErrorReporterContext.Provider value={onError ? report : null}>
        <ShortcutsContext.Provider value={shortcuts}>
          <LocaleContext.Provider value={language}>
            <ThemeProvider storageKey={themeStorageKey}>
              <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
            </ThemeProvider>
          </LocaleContext.Provider>
        </ShortcutsContext.Provider>
      </ErrorReporterContext.Provider>
    </AppNameContext.Provider>
  )
}
