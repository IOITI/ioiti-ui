import { jsx as _jsx } from "react/jsx-runtime";
import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { devWarn } from '../lib/dev.js';
import { DEFAULT_LOCALE, firstDayOf, hourCycleOf } from '../lib/locale.js';
import { mergeMessages } from '../lib/messages.js';
import { applyReducedMotion } from '../lib/motion.js';
import { en } from '../locales/en.js';
import { AppNameContext } from './app-context.js';
import { ErrorReporterContext } from './error-context.js';
import { LocaleContext } from './locale-context.js';
import { createShortcutRegistry, ShortcutsContext } from './shortcuts-context.js';
import { ThemeProvider } from './ThemeProvider.js';
/** A tag Intl takes, in its canonical form ("fr-fr" is "fr-FR"); the default one, said in development, for another. */
function canonical(locale) {
    try {
        return Intl.getCanonicalLocales(locale)[0] ?? DEFAULT_LOCALE;
    }
    catch {
        devWarn('locale-unknown', locale);
        return DEFAULT_LOCALE;
    }
}
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, its language and
 * formats, and the registry of its keyboard shortcuts (useShortcut).
 */
export function IoitiProvider({ appName, themeStorageKey, reducedMotion = 'user', onError, locale = DEFAULT_LOCALE, messages, weekStartsOn, hourCycle, children, }) {
    // For the stylesheets (motion.css), before the browser paints.
    useLayoutEffect(() => {
        applyReducedMotion(reducedMotion);
        return () => applyReducedMotion('user');
    }, [reducedMotion]);
    // The application's keyboard shortcuts, its own.
    const [shortcuts] = useState(createShortcutRegistry);
    // The application's reporter, read when an error comes: one function for the pages, whatever is given at each render.
    const onErrorRef = useRef(onError);
    useEffect(() => {
        onErrorRef.current = onError;
    });
    const report = useCallback((error, details) => onErrorRef.current?.(error, details), []);
    // The interface's locale, and its words: English's, with the language's or the application's given over them.
    const tag = canonical(locale);
    const language = useMemo(() => ({
        locale: tag,
        weekStartsOn: weekStartsOn ?? firstDayOf(tag),
        hourCycle: hourCycle ?? hourCycleOf(tag),
        catalogue: messages ? mergeMessages(en, messages) : en,
    }), [tag, messages, weekStartsOn, hourCycle]);
    // A screen reader reads the words with the rules of the page's language: the locale's, said where it names another
    // (a page without one is axe's to say).
    useEffect(() => {
        const page = document.documentElement.lang;
        const spoken = (tag) => {
            try {
                return new Intl.Locale(tag).language;
            }
            catch {
                return tag;
            }
        };
        if (page && spoken(page) !== spoken(language.locale))
            devWarn('locale-not-the-page', `${language.locale}, lang="${page}"`);
    }, [language.locale]);
    return (_jsx(AppNameContext.Provider, { value: appName ?? null, children: _jsx(ErrorReporterContext.Provider, { value: onError ? report : null, children: _jsx(ShortcutsContext.Provider, { value: shortcuts, children: _jsx(LocaleContext.Provider, { value: language, children: _jsx(ThemeProvider, { storageKey: themeStorageKey, children: _jsx(MotionConfig, { reducedMotion: reducedMotion, children: children }) }) }) }) }) }));
}
