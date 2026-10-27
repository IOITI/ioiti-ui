import { IconButton, Kbd, LookPicker, SidebarFooterButton, SpotlightSearch, ThemeToggle, useShortcut, useTheme } from 'ioiti-ui'
import { RotateCcw, Search } from 'lucide-react'
import { useState } from 'react'

import { PAGES } from './routes'

/** ⌘K, and a button for it: every page of the gallery. Then the accent and material, and the theme. */
export function GallerySearch() {
  const [open, setOpen] = useState(false)
  useShortcut('mod+k', () => setOpen(true), { description: 'Go to a page', group: 'Navigation' })
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
      <LookPicker />
      <ThemeToggle />
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to"
        placeholder="A page, a component…"
        grouped
        items={PAGES.map((page) => ({ id: page.id, title: page.label, category: page.section, href: page.path, icon: page.icon }))}
      />
    </>
  )
}

/** The sidebar's own action: back to the theme of the system. */
export function ThemeFooterButton() {
  const { setPreference } = useTheme()
  return <SidebarFooterButton icon={<RotateCcw />} label="Follow the system's theme" onClick={() => setPreference('system')} />
}
