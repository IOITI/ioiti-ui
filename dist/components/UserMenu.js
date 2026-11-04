import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, LogOut } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { Avatar } from './Avatar.js';
import { DropdownMenu } from './DropdownMenu.js';
/**
 * Who is signed in, at the end of the top bar (AppShell's `topBarEnd`): their avatar and their name, the avatar
 * alone on a narrow screen, a button that opens the menu of their account, signing out last. The menu is
 * `DropdownMenu`'s: the arrows move, a letter jumps, Escape closes, Tab leaves.
 */
export function UserMenu({ name, detail, avatarSrc, items = [], onSignOut, signOutHref, signOutLabel = 'Sign out', label = 'Account', className, }) {
    const signOut = signOutHref
        ? { type: 'link', label: signOutLabel, icon: _jsx(LogOut, {}), href: signOutHref, reloadDocument: true }
        : onSignOut
            ? { label: signOutLabel, icon: _jsx(LogOut, {}), onSelect: onSignOut }
            : null;
    const menu = signOut === null ? items : items.length > 0 ? [...items, { type: 'separator' }, signOut] : [signOut];
    return (_jsx(DropdownMenu, { label: label, align: "end", items: menu, trigger: _jsxs("button", { type: "button", className: cn('relative flex h-9 shrink-0 items-center gap-2 rounded-lg p-0.5 text-left transition-colors hover:bg-neutral-200/70 focus-ring aria-expanded:bg-neutral-200/70 sm:pr-2 dark:hover:bg-neutral-800 dark:aria-expanded:bg-neutral-800', className), children: [_jsx("span", { "aria-hidden": true, className: "flex", children: _jsx(Avatar, { name: name, src: avatarSrc }) }), _jsxs("span", { className: "sr-only leading-tight sm:not-sr-only sm:flex sm:min-w-0 sm:max-w-40 sm:flex-col", children: [_jsx("span", { className: "block truncate text-sm font-medium text-foreground", children: name }), detail && (_jsxs(_Fragment, { children: [_jsx("span", { className: "sr-only", children: "," }), ' ', _jsx("span", { className: "block truncate text-[11px] text-muted-foreground", children: detail })] }))] }), _jsx(ChevronDown, { "aria-hidden": true, className: "hidden size-3.5 shrink-0 text-muted-foreground sm:block" })] }) }));
}
