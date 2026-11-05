import type { Accent, Material } from '../lib/theme.js'

// Each accent's fill in both themes, as src/styles/accents.css gives it, and its gradient over it where it
// has one (a test holds them to it). Neutral's is ink, the primary colour of the design as it was.
// Shared by LookPicker and the appearance items of a menu (useAppearanceItems).
export const ACCENT_SWATCH: Record<Accent, string> = {
  neutral: 'bg-[var(--text-primary)]',
  violet: 'bg-[#7c3aed] dark:bg-[#a78bfa]',
  indigo: 'bg-[#4f46e5] dark:bg-[#818cf8]',
  blue: 'bg-[#2563eb] dark:bg-[#60a5fa]',
  bloom:
    'bg-[#c2398b] dark:bg-[#f39ac8] bg-linear-110/srgb from-[#d58ecf] via-[#e77ab5] to-[#fa8749] dark:from-[#f0b5e2] dark:via-[#f39ac8] dark:to-[#fca676]',
}

export const MATERIAL_SWATCH: Record<Material, string> = {
  flat: 'border border-border-hover bg-surface-raised',
  glass:
    'border border-white/70 bg-linear-to-br from-indigo-300/80 via-sky-300/80 to-pink-300/80 dark:border-white/20 dark:from-indigo-600/80 dark:via-cyan-700/80 dark:to-pink-800/80',
}
