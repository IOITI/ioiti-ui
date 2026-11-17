import type { Accent, Material, Theme, ThemePreference } from '../lib/theme.js';
export interface ThemeState {
    /** What was chosen: a theme, or to follow the system. */
    preference: ThemePreference;
    /** What is shown. */
    theme: Theme;
    setPreference: (preference: ThemePreference) => void;
    /** The accent shown: the one chosen in this browser, else the application's, else neutral. */
    accent: Accent;
    /** The material shown: the one chosen in this browser, else the application's, else flat. */
    material: Material;
    setAccent: (accent: Accent) => void;
    setMaterial: (material: Material) => void;
}
export declare const ThemeContext: import("react").Context<ThemeState>;
export declare function useTheme(): ThemeState;
