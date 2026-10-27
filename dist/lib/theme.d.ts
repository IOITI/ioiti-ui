/**
 * Light or dark. By default the interface follows the system setting, and keeps
 * following it when it changes; a choice made with the button overrides that
 * and is kept in this browser (a matter of screen and room, not of user).
 *
 * `src/theme.js` applies the same rules before the application starts.
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
/**
 * The accent: the colour of what is chosen, current or primary. `neutral` is the design as it was
 * (ink); the others are presets, checked for contrast in both themes (src/styles/accents.css).
 *
 * The material: `flat`, the surfaces as they were, or `glass`, translucent over a colour backdrop
 * (src/styles/glass.css).
 *
 * Both work with light and dark. The application gives its own (`ioiti({ accent, material })`,
 * written on <html> before the first paint); a person's choice (LookPicker) wins over it and is
 * kept beside the theme's, under the same key. The first of each list writes nothing on <html>.
 */
export declare const ACCENTS: readonly ["neutral", "violet", "indigo", "blue"];
export type Accent = (typeof ACCENTS)[number];
export declare const MATERIALS: readonly ["flat", "glass"];
export type Material = (typeof MATERIALS)[number];
/** On <html> while an accent other than neutral is shown: what the `accent:` styles hang on. */
export declare const ACCENT_ATTRIBUTE = "data-accent";
/** On <html> while the material is glass: what the `glass-*` styles hang on. */
export declare const MATERIAL_ATTRIBUTE = "data-material";
/** The accent chosen in this browser, or null: none was, or what is kept is no accent. */
export declare function readAccent(key?: string): Accent | null;
export declare function writeAccent(accent: Accent, key?: string): void;
/** The material chosen in this browser, or null. */
export declare function readMaterial(key?: string): Material | null;
export declare function writeMaterial(material: Material, key?: string): void;
/** What is shown: the accent chosen, else the application's, else neutral. Anything else is passed over. */
export declare function resolveAccent(chosen: string | null, given: string | null): Accent;
/** What is shown: the material chosen, else the application's, else flat. */
export declare function resolveMaterial(chosen: string | null, given: string | null): Material;
/** The accent the page shows now: what the pre-paint script wrote on <html>, neutral where it wrote none. */
export declare function shownAccent(root?: HTMLElement): Accent;
/** The material the page shows now, as the pre-paint script wrote it. */
export declare function shownMaterial(root?: HTMLElement): Material;
/** Neutral writes nothing: the page is then the design as it was. */
export declare function applyAccent(accent: Accent, root?: HTMLElement): void;
/** Flat writes nothing. */
export declare function applyMaterial(material: Material, root?: HTMLElement): void;
export declare const ACCENT_LABEL: Record<Accent, string>;
export declare const MATERIAL_LABEL: Record<Material, string>;
/** What the picker's button says: what it is for, and what is shown ("Accent and material: violet, glass"). */
export declare function lookLabel(accent: Accent, material: Material): string;
