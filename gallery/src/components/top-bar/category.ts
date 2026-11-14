import { PanelTop } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const topBar: CategoryInfo = {
  slug: 'top-bar',
  label: 'Top bar and account',
  icon: PanelTop,
  summary: 'What stands at the end of the top bar: who is signed in, the look they chose, the states not to miss, what happened, a way to any page, and the keys.',
  families: [
    {
      slug: 'user-menu',
      name: 'UserMenu',
      names: ['UserMenu'],
      keywords: ['account', 'profile', 'sign out', 'logout', 'avatar', 'appearance'],
      examples: [
        { id: 'in-the-top-bar', title: 'In the top bar', description: 'Who is signed in, their initials where there is no picture, a role under their name; the menu of their account: links, the look of the interface (appearance), signing out last. Below 640 px, the avatar alone.' },
        { id: 'picture', title: 'A picture, signing out at an address', description: 'Their picture from the application’s own origin; signing out at an address the server answers (signOutHref), its page loaded from the server so that nothing of the session stays in the page.' },
        { id: 'least', title: 'Its least', description: 'A name and a way out: no role, no other item, the last item’s words the application’s own.' },
      ],
    },
    {
      slug: 'avatar',
      name: 'Avatar',
      names: ['Avatar', 'AvatarGroup'],
      keywords: ['person', 'user', 'initials', 'picture', 'team'],
      examples: [
        { id: 'sizes', title: 'Sizes and initials', description: 'A person as their initials, the first letters of their first two words, named for a screen reader. With hint, the name in a hint and the avatar a stop of the keyboard.' },
        { id: 'picture', title: 'With a picture', description: 'From the application’s own origin; where it fails to load, the initials again.' },
        { id: 'group-and-more', title: 'A group, and more', description: 'Overlapping, each named in a hint; past max, the rest said as +N. Its label names the group for a screen reader.' },
        { id: 'in-a-list', title: 'In a list', description: 'Beside a name, at the size of the line: who placed an order, who works on it.' },
      ],
    },
    {
      slug: 'theme-toggle',
      name: 'ThemeToggle',
      names: ['ThemeToggle'],
      keywords: ['dark mode', 'light mode', 'theme', 'system'],
      examples: [
        { id: 'three-states', title: 'Three states', description: 'Following the system, light, dark: its icon the state it is in, its label that and what a press does. The whole page changes, in one cross-fade.' },
        { id: 'in-a-bar', title: 'At the end of a bar', description: 'Where it stands: last in the top bar, beside LookPicker; in the corner of a sign-in page.' },
      ],
    },
    {
      slug: 'look-picker',
      name: 'LookPicker',
      names: ['LookPicker'],
      keywords: ['accent', 'material', 'glass', 'colour', 'theme', 'appearance'],
      examples: [
        { id: 'beside-the-theme', title: 'Beside the theme’s button', description: 'A choice shows at once and is kept in the browser, under the application’s key; until one is made, the page shows the application’s.' },
        { id: 'shown', title: 'What is shown', description: 'The accent and the material it sets, read anywhere with useTheme(): this gallery’s own, changed by the picker here or in its top bar.' },
      ],
    },
    {
      slug: 'state-chip',
      name: 'StateChip',
      names: ['StateChip'],
      keywords: ['banner', 'status', 'warning', 'top bar', 'chip'],
      examples: [
        { id: 'tones', title: 'Its tones', description: 'Something to watch (warning), to fix (danger), good news (success): a link to where it is dealt with, its meaning in its hint.' },
        { id: 'in-the-top-bar', title: 'In the top bar', description: 'After the trail, while the state applies: nothing takes room once it is dealt with. Below 1024 px, the icon alone, its words still its name.' },
      ],
    },
    {
      slug: 'notification-bell',
      name: 'NotificationBell',
      names: ['NotificationBell'],
      keywords: ['notifications', 'inbox', 'alerts', 'unread'],
      examples: [
        { id: 'items', title: 'What happened', description: 'Newest first, each leading where it is dealt with and marked read once followed; only what is urgent pulses. Mark all as read; a footer under the list.' },
        { id: 'states', title: 'Reading, failed, empty', description: 'While they are read it says so; when they could not be, it says that, with a Try again; never “No notifications” before it knows.' },
        { id: 'quiet', title: 'A dot, without a count', description: 'showCount={false}: that there is something unread, not how much.' },
      ],
    },
    {
      slug: 'spotlight-search',
      name: 'SpotlightSearch',
      names: ['SpotlightSearch'],
      keywords: ['command palette', 'search', 'cmd k', 'go to', 'quick open'],
      examples: [
        { id: 'go-to', title: 'A palette that goes somewhere', description: 'Every word typed must be in an entry, Enter follows it. Its entries under their categories (grouped), each with its icon and its keys; the searches made before, while nothing is typed.' },
        { id: 'actions', title: 'Actions too', description: 'An entry can do something rather than lead somewhere (action); onSelect is told of each choice.' },
        { id: 'pick-several', title: 'Choosing several', description: 'closeOnSelect={false}: it stays open, each entry ticked once chosen (picked), chosen again taken back; Escape when done.' },
      ],
    },
    {
      slug: 'shortcuts-dialog',
      name: 'ShortcutsDialog',
      names: ['ShortcutsDialog'],
      keywords: ['keyboard', 'shortcuts', 'hotkeys', 'useShortcut', 'keys'],
      examples: [
        { id: 'from-a-button', title: 'From a button', description: 'Shortcuts registered where they mean something (useShortcut), listed by group: a sequence (G, then F) leads to another page. The application’s list opens on ?, this one from its button.' },
        { id: 'while-there', title: 'Heard while its part is there', description: 'A combination (⌘⇧E) is heard in a field too; a key alone waits while text is typed. Turned off (enabled), a shortcut is neither heard nor listed.' },
      ],
    },
  ],
}

export default topBar
