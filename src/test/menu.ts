import type { Menu } from '../shell/navigation.js'

export type Section = 'Work' | 'Reports' | 'Library' | 'Settings'

/** A menu shaped like an application's: a home page, pages deeper than the menu, two entries under one path. */
export const MENU: Menu<Section> = {
  sections: ['Work', 'Reports', 'Library', 'Settings'],
  entries: [
    { id: 'dashboard', path: '/', label: 'Dashboard', section: 'Work' },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work' },
    { id: 'customers', path: '/customers', label: 'Customers', section: 'Work' },
    { id: 'reports', path: '/reports', label: 'Reports', section: 'Reports' },
    { id: 'timing', path: '/timing', label: 'Delivery times', section: 'Reports' },
    { id: 'files', path: '/library/files', label: 'Files', section: 'Library' },
    { id: 'assets', path: '/library/assets', label: 'Assets', section: 'Library' },
    { id: 'archive', path: '/library/assets/archive', label: 'Archived assets', section: 'Library' },
    { id: 'settings', path: '/settings', label: 'Settings', section: 'Settings' },
  ],
}
