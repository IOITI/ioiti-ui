import type { Theme, ThemePreference } from '../lib/theme.js';
export interface ThemeState {
    /** What was chosen: a theme, or to follow the system. */
    preference: ThemePreference;
    /** What is shown. */
    theme: Theme;
    setPreference: (preference: ThemePreference) => void;
}
export declare const ThemeContext: import("react").Context<ThemeState>;
export declare function useTheme(): ThemeState;
