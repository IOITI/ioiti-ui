import { DropdownMenu, IconButton, Kbd, LookPicker, SidebarFooterButton, SpotlightSearch, ThemeToggle, useTheme } from 'ioiti-ui'
import { Languages, RotateCcw, Search } from 'lucide-react'
import { useState } from 'react'

import { FAMILIES, plainSummary } from './catalogue/catalogue'
import { LANGUAGES, useGalleryLanguage } from './language-context'
import type { GalleryLanguage } from './language-context'
import { PAGES } from './routes'

/**
 * What ⌘K finds: the pages, the categories, then each component by its name, its parts and what it does, then
 * each example (`#its-part` of its component's page).
 */
const ITEMS = [
  ...PAGES.filter((page) => !page.family).map((page) => ({
    id: page.id,
    title: page.label,
    category: page.category ? 'Groups of components' : page.section,
    description: page.category?.summary,
    href: page.path,
    icon: page.icon,
  })),
  ...FAMILIES.map(({ family, category, path }) => ({
    id: path,
    title: family.name,
    category: 'Components',
    description: plainSummary(family),
    keywords: [...family.names, ...(family.keywords ?? []), category.label],
    href: path,
  })),
  ...FAMILIES.flatMap(({ family, path }) =>
    family.examples.map((example) => ({
      id: `${path}#${example.id}`,
      title: `${family.name}: ${example.title}`,
      category: 'Examples',
      description: example.description,
      keywords: family.names,
      href: `${path}#${example.id}`,
    })),
  ),
]

/** ⌘K, and a button for it: every page, component and example of the gallery. Then the accent and material, and the theme. */
export function GallerySearch() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton
        label="Go to a page"
        hint={
          <span className="inline-flex items-center gap-2">
            Go to a page <Kbd keys="mod+k" />
          </span>
        }
        icon={<Search />}
        onClick={() => setOpen(true)}
      />
      <LanguagePicker />
      <LookPicker />
      <ThemeToggle />
      {/* Its ⌘K a shortcut of the application's (listed by ?, as its label), pressed in it closing it; the pages
          chosen last offered first. */}
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        enableGlobalShortcut
        remember="go-to"
        label="Go to a page"
        placeholder="A component, an example, a page…"
        grouped
        items={ITEMS}
      />
    </>
  )
}

/** The language of the components (and their formats): English or French. The gallery's own words stay English. */
function LanguagePicker() {
  const { language, setLanguage } = useGalleryLanguage()
  return (
    <DropdownMenu
      label="Language of the components"
      align="end"
      trigger={<IconButton label="Language of the components" hint="Language of the components" icon={<Languages />} />}
      items={[
        {
          type: 'radio',
          label: 'Components in',
          value: language,
          onValueChange: (value) => setLanguage(value as GalleryLanguage),
          options: (Object.keys(LANGUAGES) as GalleryLanguage[]).map((each) => ({ value: each, label: LANGUAGES[each].label })),
        },
      ]}
    />
  )
}

/** The sidebar's own action: back to the theme of the system. */
export function ThemeFooterButton() {
  const { setPreference } = useTheme()
  return <SidebarFooterButton icon={<RotateCcw />} label="Follow the system's theme" onClick={() => setPreference('system')} />
}
