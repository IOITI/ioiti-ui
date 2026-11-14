import { AppWindow } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const shell: CategoryInfo = {
  slug: 'shell',
  label: 'Shell',
  icon: AppWindow,
  summary: 'The frame of an application: what goes around its router, the sidebar and the top bar around every page, and the sign-in page outside them.',
  families: [
    {
      slug: 'ioiti-provider',
      name: 'IoitiProvider',
      names: ['IoitiProvider', 'ThemeProvider', 'LinkProvider'],
      keywords: ['provider', 'setup', 'theme', 'app name', 'reduced motion', 'links', 'root'],
      examples: [
        { id: 'around-the-router', title: 'Around the router', description: 'Once, around the whole application: the theme, the motion as the system asks, the keyboard shortcuts, and its name, which ends the title of every tab.' },
        { id: 'theme', title: 'The theme, read and set', description: 'What it holds for any component below it (useTheme): the preference, the theme shown, the accent and the material, and their setters. Here, this gallery’s own: a choice changes it.' },
        { id: 'parts-alone', title: 'Its parts, alone', description: 'An entry without it (a page served apart, a widget) takes what it needs: ThemeProvider for the theme, under the application’s key; LinkProvider for the links, here one that says where it would go instead of going.' },
      ],
    },
    {
      slug: 'router-root',
      name: 'RouterRoot',
      names: ['RouterRoot', 'RouterAppShell', 'RouterLink'],
      entry: 'ioiti-ui/react-router',
      keywords: ['react router', 'routes', 'layout route', 'outlet', 'link', 'createBrowserRouter'],
      examples: [
        { id: 'routes', title: 'The root and the shell', description: 'RouterRoot is the root route: every link of ioiti-ui goes through the router, and the toasts are shown. RouterAppShell is the layout route of the pages in the shell; a sign-in page stands beside it, outside.' },
        { id: 'shell-in-a-box', title: 'The shell at the router’s address', description: 'Its menu, its trail and its page follow the address of this gallery, whose router it shares: an entry leads to that page of the gallery. Drawn in a box (className="h-full").' },
        { id: 'links', title: 'The router’s link', description: 'What every component draws under RouterRoot: another page through the router, opened in another tab with ⌘ or Ctrl; a part of the page shown (#part) a plain link, which the browser scrolls to, the query kept.' },
      ],
    },
    {
      slug: 'router-leave-guard',
      name: 'RouterLeaveGuard',
      names: ['RouterLeaveGuard'],
      entry: 'ioiti-ui/react-router',
      keywords: ['unsaved', 'leave', 'dirty', 'blocker', 'beforeunload', 'navigation guard'],
      examples: [
        { id: 'unsaved', title: 'Unsaved changes, guarded', description: 'Beside a SaveBar, with the same when: another page of the application asks first (Stay or Leave), a tab closed or reloaded the browser’s own question. A change of the query alone is no leaving.' },
        { id: 'allowed', title: 'Where it lets the page go', description: 'The sign-in page a lapsed session is sent to is let through (allowed): staying would save nothing. The page’s own views that share its draft are no leaving either (within). Its words can be the page’s.' },
      ],
    },
    {
      slug: 'app-shell',
      name: 'AppShell',
      names: ['AppShell', 'AppBrand', 'SidebarFooterButton'],
      keywords: ['layout', 'frame', 'menu', 'navigation', 'sidebar', 'top bar', 'breadcrumb'],
      examples: [
        { id: 'in-a-box', title: 'A shell in a box', description: 'Given the menu and the address, it draws the sidebar, the top bar with the trail and the page. An entry under another (parent) is listed under it; a section has no heading, or folds (foldable: folded, a dot says an entry in it has a count); an entry ends with a count, or a state in its tone. Its links here change its own address, not the gallery’s.' },
        { id: 'folded', title: 'Folded at first', description: 'defaultCollapsed: the sidebar is a rail of icons, its brand the mark alone, its footer’s action an icon; each entry named in a tip. ⌘B folds the application’s own sidebar, here the gallery’s.' },
        { id: 'ends', title: 'The sidebar’s ends', description: 'The application’s name and its mark at the top (the mark alone once folded; a long name ends in an ellipsis); an action at the foot, its icon alone once folded.' },
      ],
    },
    {
      slug: 'sidebar',
      name: 'Sidebar',
      names: ['Sidebar', 'SidebarTrigger'],
      keywords: ['navigation', 'menu', 'drawer', 'rail', 'collapse'],
      examples: [
        { id: 'sections', title: 'Sections, badges and children', description: 'The menu alone, as AppShell draws it: an entry with children opens on them, a section folds, a badge counts or says a state. Without an href an entry is a button, and onActiveChange says which. Beside the page from 768 px up only (hidden md:block).' },
        { id: 'folded', title: 'Folded to its icons', description: 'collapsed and onCollapsedChange: its own Collapse button and a switch beside it agree. Folded, each entry is named in a tip, the header and the footer keep their first part.' },
        { id: 'drawer', title: 'A drawer on a phone', description: 'Below 768 px it is a drawer over the page, opened by SidebarTrigger (shown only there), closed by a choice, Escape, the scrim or a swipe. From 768 px up it stands beside the page and the trigger is hidden.' },
      ],
    },
    {
      slug: 'top-bar-trail',
      name: 'TopBarTrail',
      names: ['TopBarTrail', 'PageTrailProvider'],
      keywords: ['breadcrumb', 'trail', 'where am i', 'page name', 'parents'],
      examples: [
        { id: 'deeper-page', title: 'A page deeper than the menu', description: 'Made from the menu and the address (PageTrailProvider): Home, the section, the entry; an entry under another goes through it; a page deeper than the menu adds its parents and its name, which its PageHeader gives.' },
        { id: 'narrow', title: 'When the room runs out', description: 'Whole while it fits the room the top bar leaves it; narrower, its last two steps; on a phone, the step before the page alone, a link back. Its first step can be named (home).' },
      ],
    },
    {
      slug: 'auth-layout',
      name: 'AuthLayout',
      names: ['AuthLayout'],
      keywords: ['sign in', 'login', 'password', 'auth'],
      examples: [
        { id: 'sign-in', title: 'A sign-in page', description: 'Outside the shell: one card in the middle, the application’s mark above its name, the form, help at its foot, the theme button in the corner. Drawn here in a box; an application gives it the whole screen.' },
        { id: 'notice', title: 'What the last attempt came to', description: 'A notice above the form (an Alert): a session that ended, an account not linked. Without a logo, a tile with an icon (a lock by default); without the theme button, themeToggle={false}. The sign-in page of this gallery shows the others.' },
      ],
    },
    {
      slug: 'sign-in-providers',
      name: 'SignInProviders',
      names: ['SignInProviders'],
      keywords: ['sso', 'single sign-on', 'oidc', 'oauth', 'provider', 'sign in'],
      examples: [
        { id: 'beside-a-password', title: 'Beside a password', description: 'A button the whole width for each provider, a line between them and the form. Chosen, it is busy and the others wait, the form too, until the browser has left; here it stays, so Start again puts them back.' },
        { id: 'after-the-form', title: 'After the form, one unavailable', description: 'placement="after", the words on the line its own; a provider that cannot be used now is disabled, its hint saying why.' },
        { id: 'alone', title: 'Single sign-on alone', description: 'No password at all: the providers alone, in the look asked for (variant).' },
      ],
    },
  ],
}

export default shell
