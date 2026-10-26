import { IconButton, LookPicker, SidebarFooterButton, SpotlightSearch, ThemeToggle, useTheme } from 'ioiti-ui'
import { RotateCcw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PAGES } from './routes'

/** ⌘K, and a button for it: every page of the gallery. Then the accent and material, and the theme. */
export function GallerySearch() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <IconButton label="Go to a page (⌘K)" hint="Go to a page (⌘K)" icon={<Search />} onClick={() => setOpen(true)} />
      <LookPicker />
      <ThemeToggle />
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to"
        placeholder="A page, a component…"
        items={PAGES.map((page) => ({ id: page.id, title: page.label, category: page.section, href: page.path }))}
      />
    </>
  )
}

/** The sidebar's own action: back to the theme of the system. */
export function ThemeFooterButton() {
  const { setPreference } = useTheme()
  return <SidebarFooterButton icon={<RotateCcw />} label="Follow the system's theme" onClick={() => setPreference('system')} />
}
