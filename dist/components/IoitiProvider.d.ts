import type { ReactNode } from 'react';
import type { HourCycle, WeekDay } from '../lib/locale.js';
import type { ReducedMotion } from '../lib/motion.js';
import type { ErrorReporter } from './error-context.js';
import type { MessagesOverride } from './locale-context.js';
/** The props of `IoitiProvider`. */
export interface IoitiProviderProps {
    /** The application's name, which ends the title of every tab ("Orders · My App"). */
    appName?: string;
    /**
     * Where the theme chosen is kept in the browser: one key per application. By default the key
     * the pre-paint script was given (`ioiti({ themeStorageKey })` in vite.config), else `ioiti.theme`.
     */
    themeStorageKey?: string;
    /**
     * Animations reduced as the system asks (`user`, the default), always, or never: framer-motion's,
     * and the stylesheets' too (a change of page, the loops of spinners, `motion-safe:` and `motion-reduce:`).
     * Reduced, movement goes and fades stay.
     */
    reducedMotion?: ReducedMotion;
    /**
     * Told of every error a page shows instead of itself: one AppShell's boundary caught, or an ErrorBoundary, or the
     * router's error page (RouterErrorPage). Its place to report it: the application's error tracker, its server's log.
     * Once per error, with where it was caught (`source`) and, from a boundary, the components it was thrown in.
     */
    onError?: ErrorReporter;
    /**
     * The locale the interface speaks and writes in (BCP 47: "en-GB", "fr-FR", "en-US"): how its numbers, amounts and
     * dates are written, the day its calendars' weeks start on, its clock. `en-GB` by default. The words are the
     * catalogue's (`messages`): give both.
     */
    locale?: string;
    /**
     * The package's words: a language's catalogue (`fr` from `ioiti-ui/locales/fr`), or some words of an application's
     * own (`{ date: { today: 'Now' } }`), given over English's. A constant, not an object written in the render.
     */
    messages?: MessagesOverride;
    /** The day the calendars' weeks start on (0 Sunday, 1 Monday): the locale's by default. */
    weekStartsOn?: WeekDay;
    /** A clock of 24 hours ("h23") or 12 ("h12"): the locale's by default. */
    hourCycle?: HourCycle;
    children: ReactNode;
}
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, its language and
 * formats, and the registry of its keyboard shortcuts (useShortcut).
 */
export declare function IoitiProvider({ appName, themeStorageKey, reducedMotion, onError, locale, messages, weekStartsOn, hourCycle, children, }: IoitiProviderProps): import("react").JSX.Element;
