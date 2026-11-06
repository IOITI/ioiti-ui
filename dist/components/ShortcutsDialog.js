import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSyncExternalStore } from 'react';
import { useControllableState } from '../lib/controllable.js';
import { Kbd } from './Kbd.js';
import { useShortcut, useShortcutRegistry } from './shortcuts-context.js';
import { SettleModal } from './ui/settle-modal.js';
const GENERAL = 'General';
/**
 * The application's keyboard shortcuts, listed by group with their keys: those registered with a
 * description (`useShortcut`), while the parts that register them are on the page. `?` opens it, once
 * there is a shortcut to list; AppShell draws it.
 */
export function ShortcutsDialog({ open, onOpenChange, title = 'Keyboard shortcuts', keys = '?' }) {
    const [shown, setShown] = useControllableState(open, false, onOpenChange);
    const registry = useShortcutRegistry();
    const all = useSyncExternalStore(registry.subscribe, registry.list, registry.list);
    // What it lists: every shortcut described, but the one that opens it.
    const listed = all.filter((shortcut) => shortcut.description && shortcut.keys !== keys);
    useShortcut(keys ?? '', () => listed.length > 0 && setShown(!shown), {
        description: listed.length > 0 ? 'Show the keyboard shortcuts' : undefined,
        group: GENERAL,
        enabled: keys !== null,
    });
    const groups = new Map();
    for (const shortcut of listed) {
        const group = shortcut.group ?? GENERAL;
        groups.set(group, [...(groups.get(group) ?? []), shortcut]);
    }
    return (_jsx(SettleModal, { open: shown, onClose: () => setShown(false), title: title, size: "md", children: _jsxs("div", { className: "flex flex-col gap-5", children: [Array.from(groups.entries()).map(([group, shortcuts]) => (_jsxs("section", { children: [_jsx("h3", { className: "mb-2 text-xs font-medium text-text-secondary", children: group }), _jsx("dl", { className: "flex flex-col divide-y divide-border text-sm", children: shortcuts.map((shortcut) => (_jsxs("div", { className: "flex items-center justify-between gap-4 py-2", children: [_jsx("dt", { className: "text-text-primary", children: shortcut.description }), _jsx("dd", { children: _jsx(Kbd, { keys: shortcut.keys }) })] }, shortcut.keys))) })] }, group))), keys && (_jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsx(Kbd, { keys: keys }), " shows this list again."] }))] }) }));
}
