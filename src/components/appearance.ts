import { Palette } from 'lucide-react'
import { createElement } from 'react'
import type { ReactNode } from 'react'

import { ACCENT_LABEL, ACCENTS, MATERIAL_LABEL, MATERIALS } from '../lib/theme.js'
import type { Accent, Material, ThemePreference } from '../lib/theme.js'
import { cn } from '../lib/utils.js'

import type { DropdownMenuItem } from './DropdownMenu.js'
import { ACCENT_SWATCH, MATERIAL_SWATCH } from './look-swatches.js'
import { useTheme } from './theme-context.js'

const THEMES: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

/** A choice's words after its swatch, which says nothing to a screen reader (its words do). */
function swatched(swatch: string, shape: string, words: string, accent?: Accent): ReactNode {
  return createElement(
    'span',
    { className: 'flex items-center gap-2' },
    createElement('span', { 'aria-hidden': true, 'data-swatch': accent, className: cn('size-3 shrink-0', shape, swatch) }),
    words,
  )
}

/**
 * The look of the interface, as the items of a menu (`DropdownMenu`'s): the theme (follow the system,
 * light, dark), then a sub-menu of the accent and the material, each a choice with its swatch. Each
 * person's own, kept in this browser, as `ThemeToggle` and `LookPicker` keep them. `UserMenu`'s
 * `appearance` puts them in the menu of the account; a settings menu of its own takes them too.
 */
export function useAppearanceItems(): DropdownMenuItem[] {
  const { preference, theme, setPreference, accent, material, setAccent, setMaterial } = useTheme()
  return [
    {
      type: 'radio',
      label: 'Theme',
      value: preference,
      onValueChange: (value) => setPreference(value as ThemePreference),
      options: THEMES.map(({ value, label }) => ({
        value,
        label,
        description: value === 'system' ? `As this device: ${theme} now` : undefined,
      })),
    },
    {
      type: 'submenu',
      label: 'Accent and material',
      description: `${ACCENT_LABEL[accent]}, ${MATERIAL_LABEL[material].toLowerCase()}`,
      icon: createElement(Palette),
      textValue: 'Accent and material',
      items: [
        {
          type: 'radio',
          label: 'Accent',
          value: accent,
          onValueChange: (value) => setAccent(value as Accent),
          options: ACCENTS.map((value) => ({
            value,
            label: swatched(ACCENT_SWATCH[value], 'rounded-full', ACCENT_LABEL[value], value),
            textValue: ACCENT_LABEL[value],
          })),
        },
        {
          type: 'radio',
          label: 'Material',
          value: material,
          onValueChange: (value) => setMaterial(value as Material),
          options: MATERIALS.map((value) => ({
            value,
            label: swatched(MATERIAL_SWATCH[value], 'rounded-[4px]', MATERIAL_LABEL[value]),
            textValue: MATERIAL_LABEL[value],
          })),
        },
      ],
    },
  ]
}
