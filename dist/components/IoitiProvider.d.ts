import type { ReactNode } from 'react';
import type { ReducedMotion } from '../lib/motion.js';
interface IoitiProviderProps {
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
    children: ReactNode;
}
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, and the registry of
 * its keyboard shortcuts (useShortcut).
 */
export declare function IoitiProvider({ appName, themeStorageKey, reducedMotion, children }: IoitiProviderProps): import("react").JSX.Element;
export {};
