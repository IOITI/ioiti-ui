import type { ReactNode } from 'react';
interface ThemeProviderProps {
    /**
     * Where the choice is kept in this browser: one key per application. By default the key the
     * pre-paint script was given (its tag's `data-storage-key`), else `ioiti.theme`.
     */
    storageKey?: string;
    children: ReactNode;
}
/**
 * Holds the theme for the whole interface, a sign-in page included. While the
 * preference is to follow the system, a change of the system setting (a phone
 * going dark in the evening) is followed at once. Holds the accent and the
 * material too: the ones chosen in this browser, else the application's, which
 * the pre-paint script wrote on <html>.
 */
export declare function ThemeProvider({ storageKey, children }: ThemeProviderProps): import("react").JSX.Element;
export {};
