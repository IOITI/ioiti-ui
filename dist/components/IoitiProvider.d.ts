import type { ReactNode } from 'react';
interface IoitiProviderProps {
    /** The application's name, which ends the title of every tab ("Orders · My App"). */
    appName?: string;
    /**
     * Where the theme chosen is kept in the browser: one key per application. By default the key
     * the pre-paint script was given (`ioiti({ themeStorageKey })` in vite.config), else `ioiti.theme`.
     */
    themeStorageKey?: string;
    /** Animations reduced as the system asks (`user`, the default), always, or never. */
    reducedMotion?: 'user' | 'always' | 'never';
    children: ReactNode;
}
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, and the application's name.
 */
export declare function IoitiProvider({ appName, themeStorageKey, reducedMotion, children }: IoitiProviderProps): import("react").JSX.Element;
export {};
