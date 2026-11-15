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
  lagoon:
    'bg-[#0369a1] dark:bg-[#7cc4fa] bg-linear-110/srgb from-[#a5b4fc] via-[#7dd3fc] to-[#67e8f9] dark:from-[#c3cdfd] dark:via-[#9ad9fb] dark:to-[#8ceaf7]',
  aurora:
    'bg-[#a21caf] dark:bg-[#e9a0f5] bg-linear-110/srgb from-[#8ec5ff] via-[#b9a4ff] to-[#f0a6f0] dark:from-[#b5d8ff] dark:via-[#cdbcff] dark:to-[#f5bdf5]',
  dusk:
    'bg-[#5b4b8a] dark:bg-[#b3a6e0] bg-linear-110/srgb from-[#b8b0f0] via-[#d7a6c9] to-[#f6bc9a] dark:from-[#cdc6f6] dark:via-[#e5bfd9] dark:to-[#f9cfb4]',
  golden:
    'bg-[#b0436e] dark:bg-[#f4a6c4] bg-linear-110/srgb from-[#f3d38a] via-[#f7b98a] to-[#f2a0a8] dark:from-[#f7dfa6] dark:via-[#f9c9a3] dark:to-[#f5b6bd]',
}

export const MATERIAL_SWATCH: Record<Material, string> = {
  flat: 'border border-border-hover bg-surface-raised',
  glass:
    'border border-white/70 bg-linear-to-br from-indigo-300/80 via-sky-300/80 to-pink-300/80 dark:border-white/20 dark:from-indigo-600/80 dark:via-cyan-700/80 dark:to-pink-800/80',
}
