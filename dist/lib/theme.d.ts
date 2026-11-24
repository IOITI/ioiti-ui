/**
 * Light or dark. By default the interface follows the system setting, and keeps
 * following it when it changes; a choice made with the button overrides that
 * and is kept in this browser (a matter of screen and room, not of user).
 *
 * `src/theme.js` applies the same rules before the application starts.
 */
import type { Messages } from '../locales/en.js';
import type { BoundCatalogue } from './messages.js';
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
/** The words of the look, bound to a locale: a provider's (`useMessages().look`), English's by default. */
export type LookWords = BoundCatalogue<Messages>['look'];
/**
 * What the button says, in the words given (English's by default): where things stand, and what a press does.
 * "Always" tells a chosen theme from the same one arrived at by following the system.
 */
export declare function themeButtonLabel(preference: ThemePreference, theme: Theme, words?: LookWords): string;
/**
 * What the button says, in English: where things stand, and what a press does ("Theme: always light. Press for always
 * dark.").
 * @deprecated English whatever the language: ThemeToggle says it in the provider's (the catalogue's `look`:
 * `useMessages().look.themeButton`, its states and presses). Removed in 1.0.
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
 * `bloom`, `lagoon`, `aurora`, `dusk` and `golden` (Golden hour) are grainy gradients: a colour of
 * their own on all of these, the gradient on a filled button and the application's mark, and under
 * glass their washes as the backdrop.
 *
 * The material: `flat`, the surfaces as they were, or `glass`, translucent over a colour backdrop
 * (src/styles/glass.css).
 *
 * Both work with light and dark. The application gives its own (`ioiti({ accent, material })`,
 * written on <html> before the first paint); a person's choice (LookPicker) wins over it and is
 * kept beside the theme's, under the same key. The first of each list writes nothing on <html>.
 */
export declare const ACCENTS: readonly ["neutral", "violet", "indigo", "blue", "bloom", "lagoon", "aurora", "dusk", "golden"];
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
/** An accent's name in the words given (English's by default): "Violet", "Golden hour". */
export declare function accentName(accent: Accent, words?: LookWords): string;
/** A material's name in the words given (English's by default): "Flat", "Glass". */
export declare function materialName(material: Material, words?: LookWords): string;
/**
 * The accents' names, in English.
 * @deprecated English whatever the language: the catalogue's `look` names them (`useMessages().look.accentViolet`…, or
 * `en.look` from 'ioiti-ui/locales/en'). Removed in 1.0.
 */
export declare const ACCENT_LABEL: Record<Accent, string>;
/**
 * The materials' names, in English.
 * @deprecated English whatever the language: the catalogue's `look` names them (`useMessages().look.materialGlass`…, or
 * `en.look` from 'ioiti-ui/locales/en'). Removed in 1.0.
 */
export declare const MATERIAL_LABEL: Record<Material, string>;
/** What the picker's button says, in the words given (English's by default): what it is for, and what is shown ("Accent and material: violet, glass"). */
export declare function lookLabel(accent: Accent, material: Material, words?: LookWords): string;
