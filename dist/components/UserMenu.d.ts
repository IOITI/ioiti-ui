import type { ReactNode } from 'react';
import type { DropdownMenuItem } from './DropdownMenu.js';
interface UserMenuProps {
    /** Who is signed in: beside the avatar from 640 px up, and its initials where there is no picture. */
    name: string;
    /** A second line, under the name: their role ("Analyst"), their team. */
    detail?: ReactNode;
    /** Their picture, from the application's own origin; their initials without one, or where it fails. */
    avatarSrc?: string;
    /**
     * What the menu offers before signing out, as `DropdownMenu` takes it: a link leads somewhere through the
     * application's link (a profile, the settings), an action does something.
     */
    items?: DropdownMenuItem[];
    /** Signs out in code (a request, then the sign-in page): an action, the menu's last item. */
    onSignOut?: () => void;
    /**
     * Signs out at an address the server answers (`/api/v1/auth/logout`): a link, the menu's last item, its page
     * loaded from the server, so that nothing of the session stays in the page. In place of `onSignOut`.
     */
    signOutHref?: string;
    /** The words of the last item. */
    signOutLabel?: string;
    /** The menu's name for a screen reader. Its button is named by what it shows: the name and the detail. */
    label?: string;
    className?: string;
}
/**
 * Who is signed in, at the end of the top bar (AppShell's `topBarEnd`): their avatar and their name, the avatar
 * alone on a narrow screen, a button that opens the menu of their account, signing out last. The menu is
 * `DropdownMenu`'s: the arrows move, a letter jumps, Escape closes, Tab leaves.
 */
export declare function UserMenu({ name, detail, avatarSrc, items, onSignOut, signOutHref, signOutLabel, label, className, }: UserMenuProps): import("react").JSX.Element;
export {};
