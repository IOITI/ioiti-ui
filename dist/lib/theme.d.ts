/**
 * Light or dark. By default the interface follows the system setting, and keeps
 * following it when it changes; a choice made with the button overrides that
 * and is kept in this browser (a matter of screen and room, not of user).
 *
 * `src/theme.js` applies the same rule before the application starts.
 */
export type Theme = 'light' | 'dark';
export type ThemePreference = 'system' | Theme;
/** Where the choice is kept when the application names no key of its own. One key per application. */
export declare const DEFAULT_THEME_STORAGE_KEY = "ioiti.theme";
/** Written on <html> by the pre-paint script: the key its tag was given (`data-storage-key`). */
export declare const THEME_KEY_ATTRIBUTE = "data-theme-storage-key";
/** The key the choice is kept under: the one given, else the pre-paint script's, else the default. */
export declare function themeStorageKey(given?: string): string;
export declare function readPreference(key?: string): ThemePreference;
export declare function writePreference(preference: ThemePreference, key?: string): void;
export declare function resolveTheme(preference: ThemePreference, systemIsDark: boolean): Theme;
/** What the button goes to next: the system's choice, then light, then dark. */
export declare function nextPreference(preference: ThemePreference): ThemePreference;
/**
 * What the button says: where things stand, and what a press does. "Always"
 * tells a chosen theme from the same one arrived at by following the system.
 */
export declare function themeLabel(preference: ThemePreference, theme: Theme): string;
export declare function systemIsDark(): boolean;
/** Calls `onChange` when the system goes from light to dark or back. Returns what stops it. */
export declare function watchSystem(onChange: () => void): () => void;
/** The class every `dark:` style hangs on. Native controls and scrollbars follow through `color-scheme` (design.css). */
export declare function applyTheme(theme: Theme, root?: HTMLElement): void;
