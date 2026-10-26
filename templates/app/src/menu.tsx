import type { Menu } from 'ioiti-ui'
import { LayoutDashboard, ListChecks } from 'lucide-react'

/** The menu: the sidebar lists it, and the top bar says where each page stands in it. */
export const MENU: Menu = {
  sections: ['Work'],
  entries: [
    { id: 'dashboard', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'items', path: '/items', label: 'Items', section: 'Work', icon: <ListChecks /> },
  ],
}
