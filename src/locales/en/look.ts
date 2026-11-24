import type { Theme } from '../../lib/theme.js'

/** The look: ThemeToggle, LookPicker, the appearance menu (`useAppearanceItems`), the themes, accents and materials named. */
export const look = {
  /** "Theme": the name of the appearance menu's choice of theme. */
  theme: 'Theme',
  /** "System": the theme that follows the system's setting. */
  system: 'System',
  /** "Light": the light theme. */
  light: 'Light',
  /** "Dark": the dark theme. */
  dark: 'Dark',
  /** "As this device: dark now": under System in the appearance menu, the theme the device has now. */
  systemNow: (theme: Theme) => `As this device: ${theme} now`,
  /** "Theme: always light. Press for always dark.": ThemeToggle's name and title, where things stand and what a press does. */
  themeButton: ({ state, press }: { state: string; press: string }) => `Theme: ${state}. ${press}.`,
  /** "follows the system (dark now)": where ThemeToggle stands while it follows the system, with the theme that gives. */
  followsSystem: (theme: Theme) => `follows the system (${theme} now)`,
  /** "always light": where ThemeToggle stands once light is chosen ("always" tells it from the system's light). */
  alwaysLight: 'always light',
  /** "always dark": where it stands once dark is chosen. */
  alwaysDark: 'always dark',
  /** "Press to follow the system": what a press does, the theme then following the system. */
  pressToFollowSystem: 'Press to follow the system',
  /** "Press for always light": what a press does, the theme then always light. */
  pressForLight: 'Press for always light',
  /** "Press for always dark": what a press does, the theme then always dark. */
  pressForDark: 'Press for always dark',
  /** "Accent and material": LookPicker's hint and the name of its choices, the appearance menu's sub-menu. */
  accentAndMaterial: 'Accent and material',
  /** "Accent and material: violet, glass": LookPicker's button named with what is shown (the names given, as they are). */
  lookName: ({ accent, material }: { accent: string; material: string }) =>
    `Accent and material: ${accent.toLowerCase()}, ${material.toLowerCase()}`,
  /** "Violet, glass": what the appearance menu's sub-menu says is shown (the names given, as they are). */
  lookDescription: ({ accent, material }: { accent: string; material: string }) => `${accent}, ${material.toLowerCase()}`,
  /** "Accent": the heading of the accents. */
  accent: 'Accent',
  /** "Material": the heading of the materials. */
  material: 'Material',
  /** "Neutral": the design as it was, in ink. */
  accentNeutral: 'Neutral',
  /** "Violet". */
  accentViolet: 'Violet',
  /** "Indigo". */
  accentIndigo: 'Indigo',
  /** "Blue". */
  accentBlue: 'Blue',
  /** "Bloom": a printed flyer's colours, a grainy gradient (lilac, pink, tangerine). */
  accentBloom: 'Bloom',
  /** "Lagoon": a sea, a grainy gradient (periwinkle, sky, aqua). */
  accentLagoon: 'Lagoon',
  /** "Aurora": the northern lights, a grainy gradient (sky, violet, magenta). */
  accentAurora: 'Aurora',
  /** "Dusk": the sky after sunset, a grainy gradient (lavender, mauve, peach). */
  accentDusk: 'Dusk',
  /** "Golden hour": the light before sunset, a grainy gradient (gold, apricot, rose). */
  accentGolden: 'Golden hour',
  /** "Flat": the surfaces as they were. */
  materialFlat: 'Flat',
  /** "Glass": translucent surfaces over a colour backdrop. */
  materialGlass: 'Glass',
}
