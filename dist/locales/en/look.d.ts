import type { Theme } from '../../lib/theme.js';
/** The look: ThemeToggle, LookPicker, the appearance menu (`useAppearanceItems`), the themes, accents and materials named. */
export declare const look: {
    /** "Theme": the name of the appearance menu's choice of theme. */
    theme: string;
    /** "System": the theme that follows the system's setting. */
    system: string;
    /** "Light": the light theme. */
    light: string;
    /** "Dark": the dark theme. */
    dark: string;
    /** "As this device: dark now": under System in the appearance menu, the theme the device has now. */
    systemNow: (theme: Theme) => string;
    /** "Theme: always light. Press for always dark.": ThemeToggle's name and title, where things stand and what a press does. */
    themeButton: ({ state, press }: {
        state: string;
        press: string;
    }) => string;
    /** "follows the system (dark now)": where ThemeToggle stands while it follows the system, with the theme that gives. */
    followsSystem: (theme: Theme) => string;
    /** "always light": where ThemeToggle stands once light is chosen ("always" tells it from the system's light). */
    alwaysLight: string;
    /** "always dark": where it stands once dark is chosen. */
    alwaysDark: string;
    /** "Press to follow the system": what a press does, the theme then following the system. */
    pressToFollowSystem: string;
    /** "Press for always light": what a press does, the theme then always light. */
    pressForLight: string;
    /** "Press for always dark": what a press does, the theme then always dark. */
    pressForDark: string;
    /** "Accent and material": LookPicker's hint and the name of its choices, the appearance menu's sub-menu. */
    accentAndMaterial: string;
    /** "Accent and material: violet, glass": LookPicker's button named with what is shown (the names given, as they are). */
    lookName: ({ accent, material }: {
        accent: string;
        material: string;
    }) => string;
    /** "Violet, glass": what the appearance menu's sub-menu says is shown (the names given, as they are). */
    lookDescription: ({ accent, material }: {
        accent: string;
        material: string;
    }) => string;
    /** "Accent": the heading of the accents. */
    accent: string;
    /** "Material": the heading of the materials. */
    material: string;
    /** "Neutral": the design as it was, in ink. */
    accentNeutral: string;
    /** "Violet". */
    accentViolet: string;
    /** "Indigo". */
    accentIndigo: string;
    /** "Blue". */
    accentBlue: string;
    /** "Bloom": a printed flyer's colours, a grainy gradient (lilac, pink, tangerine). */
    accentBloom: string;
    /** "Lagoon": a sea, a grainy gradient (periwinkle, sky, aqua). */
    accentLagoon: string;
    /** "Aurora": the northern lights, a grainy gradient (sky, violet, magenta). */
    accentAurora: string;
    /** "Dusk": the sky after sunset, a grainy gradient (lavender, mauve, peach). */
    accentDusk: string;
    /** "Golden hour": the light before sunset, a grainy gradient (gold, apricot, rose). */
    accentGolden: string;
    /** "Flat": the surfaces as they were. */
    materialFlat: string;
    /** "Glass": translucent surfaces over a colour backdrop. */
    materialGlass: string;
};
