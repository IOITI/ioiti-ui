import { ChevronDown, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { useAppearanceItems } from './appearance.js'
import { Avatar } from './Avatar.js'
import { DropdownMenu } from './DropdownMenu.js'
import type { DropdownMenuItem } from './DropdownMenu.js'

interface UserMenuProps {
  /** Who is signed in: beside the avatar from 640 px up, and its initials where there is no picture. */
  name: string
  /** A second line, under the name: their role ("Analyst"), their team. */
  detail?: ReactNode
  /** Their picture, from the application's own origin; their initials without one, or where it fails. */
  avatarSrc?: string
  /**
   * What the menu offers before signing out, as `DropdownMenu` takes it: a link leads somewhere through the
   * application's link (a profile, the settings), an action does something.
   */
  items?: DropdownMenuItem[]
  /**
   * The look of the interface in the menu, after the items: the theme (system, light, dark), then a sub-menu
   * of the accent and the material (`useAppearanceItems`), each person's own, kept in this browser. In place
   * of `ThemeToggle` and `LookPicker` in the top bar.
   */
  appearance?: boolean
  /** Signs out in code (a request, then the sign-in page): an action, the menu's last item. */
  onSignOut?: () => void
  /**
   * Signs out at an address the server answers (`/api/v1/auth/logout`): a link, the menu's last item, its page
   * loaded from the server, so that nothing of the session stays in the page. In place of `onSignOut`.
   */
  signOutHref?: string
  /** The words of the last item. */
  signOutLabel?: string
  /** The menu's name for a screen reader. Its button is named by what it shows: the name and the detail. */
  label?: string
  className?: string
}

/**
 * Who is signed in, at the end of the top bar (AppShell's `topBarEnd`): their avatar and their name, the avatar
 * alone on a narrow screen, a button that opens the menu of their account, signing out last; with
 * `appearance`, the theme, the accent and the material before it. The menu is `DropdownMenu`'s: the arrows
 * move, a letter jumps, Escape closes, Tab leaves.
 */
export function UserMenu({
  name,
  detail,
  avatarSrc,
  items = [],
  appearance = false,
  onSignOut,
  signOutHref,
  signOutLabel = 'Sign out',
  label = 'Account',
  className,
}: UserMenuProps) {
  const signOut: DropdownMenuItem | null = signOutHref
    ? { type: 'link', label: signOutLabel, icon: <LogOut />, href: signOutHref, reloadDocument: true }
    : onSignOut
      ? { label: signOutLabel, icon: <LogOut />, onSelect: onSignOut }
      : null
  const look = useAppearanceItems()
  const given: DropdownMenuItem[] = appearance ? (items.length > 0 ? [...items, { type: 'separator' }, ...look] : look) : items
  const menu: DropdownMenuItem[] = signOut === null ? given : given.length > 0 ? [...given, { type: 'separator' }, signOut] : [signOut]

  return (
    <DropdownMenu
      label={label}
      align="end"
      items={menu}
      trigger={
        <button
          type="button"
          className={cn(
            'relative flex h-9 shrink-0 items-center gap-2 rounded-lg p-0.5 text-left transition-colors hover:bg-neutral-200/70 focus-ring aria-expanded:bg-neutral-200/70 sm:pr-2 dark:hover:bg-neutral-800 dark:aria-expanded:bg-neutral-800',
            className,
          )}
        >
          {/* The name says who it is: the picture or the initials are said once, not twice. */}
          <span aria-hidden className="flex">
            <Avatar name={name} src={avatarSrc} />
          </span>
          {/* On a narrow screen, the avatar alone shows; the name is still the button's for a screen reader. */}
          <span className="sr-only leading-tight sm:not-sr-only sm:flex sm:min-w-0 sm:max-w-40 sm:flex-col">
            <span className="block truncate text-sm font-medium text-foreground">{name}</span>
            {detail && (
              <>
                <span className="sr-only">,</span>{' '}
                <span className="block truncate text-[11px] text-muted-foreground">{detail}</span>
              </>
            )}
          </span>
          <ChevronDown aria-hidden className="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />
        </button>
      }
    />
  )
}
