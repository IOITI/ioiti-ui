import { Palette } from 'lucide-react'
import { createElement } from 'react'
import type { ReactNode } from 'react'

import { accentName, ACCENTS, materialName, MATERIALS } from '../lib/theme.js'
import type { Accent, Material, ThemePreference } from '../lib/theme.js'
import { cn } from '../lib/utils.js'

import type { DropdownMenuItem } from './DropdownMenu.js'
import { useMessages } from './locale-context.js'
import { ACCENT_SWATCH, MATERIAL_SWATCH } from './look-swatches.js'
import { useTheme } from './theme-context.js'

const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark']

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
 * `appearance` puts them in the menu of the account; a settings menu of its own takes them too. Their words are the
 * provider's language's.
 */
export function useAppearanceItems(): DropdownMenuItem[] {
  const { preference, theme, setPreference, accent, material, setAccent, setMaterial } = useTheme()
  const words = useMessages().look
  return [
    {
      type: 'radio',
      label: words.theme,
      value: preference,
      onValueChange: (value) => setPreference(value as ThemePreference),
      options: THEMES.map((value) => ({
        value,
        label: words[value],
        description: value === 'system' ? words.systemNow(theme) : undefined,
      })),
    },
    {
      type: 'submenu',
      label: words.accentAndMaterial,
      description: words.lookDescription({ accent: accentName(accent, words), material: materialName(material, words) }),
      icon: createElement(Palette),
      textValue: words.accentAndMaterial,
      items: [
        {
          type: 'radio',
          label: words.accent,
          value: accent,
          onValueChange: (value) => setAccent(value as Accent),
          options: ACCENTS.map((value) => ({
            value,
            label: swatched(ACCENT_SWATCH[value], 'rounded-full', accentName(value, words), value),
            textValue: accentName(value, words),
          })),
        },
        {
          type: 'radio',
          label: words.material,
          value: material,
          onValueChange: (value) => setMaterial(value as Material),
          options: MATERIALS.map((value) => ({
            value,
            label: swatched(MATERIAL_SWATCH[value], 'rounded-[4px]', materialName(value, words)),
            textValue: materialName(value, words),
          })),
        },
      ],
    },
  ]
}
